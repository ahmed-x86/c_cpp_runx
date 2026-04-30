import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
import * as fs from 'fs';


export let diagnosticCollection: vscode.DiagnosticCollection;

const errorGutterDecoration = vscode.window.createTextEditorDecorationType({
    gutterIconPath: vscode.Uri.parse(`data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%3E%3Ccircle%20cx%3D%228%22%20cy%3D%228%22%20r%3D%224%22%20fill%3D%22%23e51400%22%2F%3E%3C%2Fsvg%3E`),
    gutterIconSize: '60%'
});

export function setupDiagnostics(context: vscode.ExtensionContext) {
    diagnosticCollection = vscode.languages.createDiagnosticCollection('c_cpp_runx');
    context.subscriptions.push(diagnosticCollection);
}

function getGccErrorRange(lineText: string, lineIndex: number, colIndex: number, message: string): vscode.Range {
    let length = 1;
    const quoteMatch = message.match(/['‘`"]([^'’`"]+)['’`"]/);
    
    if (quoteMatch) {
        length = quoteMatch[1].length;
    } else {
        const restOfLine = lineText.substring(colIndex);
        const wordMatch = restOfLine.match(/^(\w+)/);
        if (wordMatch) {
            length = wordMatch[1].length;
        }
    }
    
    return new vscode.Range(lineIndex, colIndex, lineIndex, colIndex + length);
}

export async function checkSyntax(compiler: string, filePath: string, document: vscode.TextDocument): Promise<boolean> {
    return new Promise((resolve) => {
        const dirPath = path.dirname(filePath);
        const fileName = path.basename(filePath);
        
        
        const checkArgs = compiler.includes('tcc') ? '-c' : '-fsyntax-only';
        const cmd = `${compiler} ${checkArgs} "${fileName}"`;

        cp.exec(cmd, { cwd: dirPath }, (error, stdout, stderr) => {
            const output = (stderr || '') + '\n' + (stdout || '');
            const diagnostics: vscode.Diagnostic[] = [];
            const errorRanges: vscode.Range[] = [];

            
            const gccRegex = /^(?:[a-zA-Z]:\\[^:]+|[^:]+):(\d+):(\d+):\s+(error|warning|fatal error):\s+(.*)$/gm;
            let match;

            while ((match = gccRegex.exec(output)) !== null) {
                const line = parseInt(match[1], 10) - 1; 
                const col = parseInt(match[2], 10) - 1;
                const severityStr = match[3].toLowerCase();
                const message = match[4];

                const severity = severityStr.includes('warning') ? vscode.DiagnosticSeverity.Warning : vscode.DiagnosticSeverity.Error;
                
                const safeLine = Math.max(0, Math.min(line, document.lineCount - 1));
                const lineText = document.lineAt(safeLine).text;
                const safeCol = Math.max(0, Math.min(col, lineText.length));

                const range = getGccErrorRange(lineText, safeLine, safeCol, message);
                
                diagnostics.push(new vscode.Diagnostic(range, `RunX: ${message}`, severity));
                
                if (severity === vscode.DiagnosticSeverity.Error) {
                    errorRanges.push(range);
                }
            }

            const editor = vscode.window.activeTextEditor;

            if (diagnostics.length > 0) {
                diagnosticCollection.set(document.uri, diagnostics);
                if (editor && editor.document.uri.toString() === document.uri.toString()) {
                    editor.setDecorations(errorGutterDecoration, errorRanges);
                }
                
                const hasErrors = diagnostics.some(d => d.severity === vscode.DiagnosticSeverity.Error);
                if (hasErrors) {
                    vscode.window.showErrorMessage(`C/C++ RunX: Found compilation errors. Check the red squiggles! ❌`);
                    resolve(false); 
                    return;
                }
            }
            
            diagnosticCollection.clear();
            if (editor) {
                editor.setDecorations(errorGutterDecoration, []);
            }
            
            if (compiler.includes('tcc')) {
                const tempObj = path.join(dirPath, fileName.replace(/\.[^/.]+$/, ".o"));
                if (fs.existsSync(tempObj)) fs.unlinkSync(tempObj);
            }
            
            resolve(true); 
        });
    });
}


export function activate(context: vscode.ExtensionContext) {

    
    setupDiagnostics(context);

    
    const getCCompiler = () => context.globalState.get<string>('c_compiler_choice', 'gcc');
    const getHideWineLogs = () => context.globalState.get<boolean>('hide_wine_logs', false);
    const getBuildProfile = () => context.globalState.get<string>('build_profile', 'Normal');
    
    
    const getBuildFlagsStr = () => {
        const profile = getBuildProfile();
        return profile === 'Release (-O3 -s)' ? ' -O3 -s' : '';
    };

    const isWindows = process.platform === 'win32';

    const disposable = vscode.commands.registerCommand('c-cpp-runx.showMenu', async () => {
        
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Please open a C or C++ file first!');
            return;
        }

        const document = editor.document;
        const filePath = document.fileName;
        const fileExt = path.extname(filePath).toLowerCase();
        
        const dirPath = path.dirname(filePath);
        const fileName = path.basename(filePath);
        const fileNameWithoutExt = path.basename(filePath, fileExt);

        let compiler = '';
        if (['.cpp', '.c++', '.cc', '.cxx'].includes(fileExt)) {
            compiler = 'g++';
        } else if (fileExt === '.c') {
            compiler = getCCompiler();
        } else {
            vscode.window.showErrorMessage('Unsupported file extension!');
            return;
        }

        await document.save();

        const outFileName = isWindows ? `${fileNameWithoutExt}.exe` : fileNameWithoutExt;
        const runPrefix = isWindows ? `.\\` : `./`;
        const runxName = (fileExt === '.c') ? 'RunX c' : 'RunX c++';
        const buildProfileInfo = getBuildProfile() === 'Normal' ? '' : ` [${getBuildProfile()}]`;

        const options = [
            {
                label: `$(zap) ${runxName}${buildProfileInfo}`,
                description: `Compile with ${compiler} and run natively`,
                id: 'runx-dynamic'
            },
            {
                label: `$(file-code) Compile to Assembly (AT&T)${buildProfileInfo}`,
                description: 'Generate .s file',
                id: 'asm-att'
            },
            {
                label: `$(file-binary) Compile to Assembly (Intel)${buildProfileInfo}`,
                description: 'Generate Intel syntax .s file',
                id: 'asm-intel'
            }
        ];

        if (!isWindows) {
            options.push({
                label: `$(terminal-cmd) Compile to Windows & Run (Wine)${buildProfileInfo}`,
                description: 'Cross-compile via MinGW and execute with Wine',
                id: 'runx-wine'
            });
        }

        const selection = await vscode.window.showQuickPick(options, {
            placeHolder: 'Select a build/run option...'
        });

        if (selection) {
            
            let compilerToCheck = compiler;
            if (selection.id === 'runx-wine') {
                compilerToCheck = (fileExt === '.c') ? 'x86_64-w64-mingw32-gcc' : 'x86_64-w64-mingw32-g++';
            }
            
            const isSyntaxValid = await checkSyntax(compilerToCheck, filePath, document);
            if (!isSyntaxValid) {
                return; 
            }

            const terminalName = 'C/C++ RunX';
            let terminal = vscode.window.terminals.find(t => t.name === terminalName);
            if (!terminal) {
                terminal = vscode.window.createTerminal(terminalName);
            }
            terminal.show();

            const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
            const flagsStr = getBuildFlagsStr();

            if (selection.id === 'runx-dynamic') {
                terminal.sendText(`cd "${dirPath}"`);
                await sleep(100);
                terminal.sendText(`${compiler}${flagsStr} "${fileName}" -o "${outFileName}"`);
                await sleep(100);
                terminal.sendText(`${runPrefix}"${outFileName}"`);
                
            } else if (selection.id === 'asm-att') {
                terminal.sendText(`cd "${dirPath}"`);
                await sleep(100);
                terminal.sendText(`${compiler}${flagsStr} -S "${fileName}"`);
                
            } else if (selection.id === 'asm-intel') {
                terminal.sendText(`cd "${dirPath}"`);
                await sleep(100);
                terminal.sendText(`${compiler}${flagsStr} -S -masm=intel -fverbose-asm "${fileName}"`);
                
            } else if (selection.id === 'runx-wine') {
                const crossCompiler = (fileExt === '.c') ? 'x86_64-w64-mingw32-gcc' : 'x86_64-w64-mingw32-g++';
                const exeName = `${fileNameWithoutExt}.exe`;
                
                terminal.sendText(`cd "${dirPath}"`);
                await sleep(100);
                terminal.sendText(`${crossCompiler}${flagsStr} "${fileName}" -o "${exeName}" -static`);
                await sleep(100);
                
                const hideLogs = getHideWineLogs();
                const wineCommand = hideLogs 
                    ? `WINEDEBUG=-all wine "${exeName}" 2>/dev/null` 
                    : `WINEDEBUG=-all wine "${exeName}"`;
                
                terminal.sendText(wineCommand);
            }
        }
    });

    context.subscriptions.push(disposable);

    const settingsMenuDisposable = vscode.commands.registerCommand('c-cpp-runx.runxSettings', async () => {
        const currentCompiler = getCCompiler();
        const hideLogs = getHideWineLogs();
        const buildProfile = getBuildProfile();

        const mainOptions = [
            { 
                label: '$(gear) change c compiler', 
                description: `Current: ${currentCompiler}`, 
                id: 'change_compiler' 
            },
            {
                label: hideLogs ? '$(eye) turn ON wine logs' : '$(eye-closed) turn OFF wine logs',
                description: hideLogs ? 'Current: OFF (Showing results only)' : 'Current: ON (Showing logs & errors)',
                id: 'toggle_wine_logs'
            },
            {
                label: buildProfile === 'Normal' ? '$(tools) Build Profile' : '$(rocket) Build Profile',
                description: `Current: ${buildProfile}`,
                id: 'toggle_build_profile'
            }
        ];

        const selection = await vscode.window.showQuickPick(mainOptions, {
            placeHolder: 'RunX Settings'
        });

        if (selection) {
            if (selection.id === 'change_compiler') {
                const subOptions = [
                    { label: 'gcc', description: 'Use GNU Compiler Collection' },
                    { label: 'tcc', description: 'Use Tiny C Compiler' }
                ];

                const subSelection = await vscode.window.showQuickPick(subOptions, {
                    placeHolder: 'Select a C Compiler'
                });

                if (subSelection) {
                    await context.globalState.update('c_compiler_choice', subSelection.label);
                    vscode.window.showInformationMessage(`C Compiler successfully changed to: ${subSelection.label}`);
                }
            } else if (selection.id === 'toggle_wine_logs') {
                const newState = !hideLogs;
                await context.globalState.update('hide_wine_logs', newState);
                vscode.window.showInformationMessage(`Wine logs are now ${newState ? 'OFF' : 'ON'}`);
            } else if (selection.id === 'toggle_build_profile') {
                const profiles = [
                    { label: 'Normal', description: 'Default compilation without extra flags' },
                    { label: 'Release (-O3 -s)', description: 'Full optimization and stripped symbols' }
                ];
                
                const subSelection = await vscode.window.showQuickPick(profiles, {
                    placeHolder: 'Select Build Profile'
                });

                if (subSelection) {
                    await context.globalState.update('build_profile', subSelection.label);
                    vscode.window.showInformationMessage(`Build Profile set to: ${subSelection.label}`);
                }
            }
        }
    });

    context.subscriptions.push(settingsMenuDisposable);

    const runCDisposable = vscode.commands.registerCommand('c-cpp-runx.runC', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        const document = editor.document;
        const dirPath = path.dirname(document.fileName);
        const fileName = path.basename(document.fileName);
        const fileNameWithoutExt = path.basename(document.fileName, path.extname(document.fileName));

        const outFileName = isWindows ? `${fileNameWithoutExt}.exe` : fileNameWithoutExt;
        const runPrefix = isWindows ? `.\\` : `./`;

        await document.save();

        const compiler = getCCompiler();
        
        // فحص الأخطاء قبل التشغيل المباشر
        const isSyntaxValid = await checkSyntax(compiler, document.fileName, document);
        if (!isSyntaxValid) return;

        const terminalName = 'C/C++ RunX';
        let terminal = vscode.window.terminals.find(t => t.name === terminalName);
        if (!terminal) {
            terminal = vscode.window.createTerminal(terminalName);
        }
        terminal.show();

        const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
        const flagsStr = getBuildFlagsStr();

        terminal.sendText(`cd "${dirPath}"`);
        await sleep(100);
        terminal.sendText(`${compiler}${flagsStr} "${fileName}" -o "${outFileName}"`);
        await sleep(100);
        terminal.sendText(`${runPrefix}"${outFileName}"`);
    });

    const runCppDisposable = vscode.commands.registerCommand('c-cpp-runx.runCpp', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        const document = editor.document;
        const dirPath = path.dirname(document.fileName);
        const fileName = path.basename(document.fileName);
        const fileNameWithoutExt = path.basename(document.fileName, path.extname(document.fileName));

        const outFileName = isWindows ? `${fileNameWithoutExt}.exe` : fileNameWithoutExt;
        const runPrefix = isWindows ? `.\\` : `./`;

        await document.save();

        // فحص الأخطاء قبل التشغيل المباشر
        const isSyntaxValid = await checkSyntax('g++', document.fileName, document);
        if (!isSyntaxValid) return;

        const terminalName = 'C/C++ RunX';
        let terminal = vscode.window.terminals.find(t => t.name === terminalName);
        if (!terminal) {
            terminal = vscode.window.createTerminal(terminalName);
        }
        terminal.show();

        const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
        const flagsStr = getBuildFlagsStr();

        terminal.sendText(`cd "${dirPath}"`);
        await sleep(100);
        terminal.sendText(`g++${flagsStr} "${fileName}" -o "${outFileName}"`);
        await sleep(100);
        terminal.sendText(`${runPrefix}"${outFileName}"`);
    });

    context.subscriptions.push(runCDisposable, runCppDisposable);
}

export function deactivate() {}
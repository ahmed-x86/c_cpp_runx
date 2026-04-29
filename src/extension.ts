import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

    // دالة مساعدة لجلب مترجم C الحالي المحفوظ في إعدادات الإضافة (الافتراضي هو gcc)
    const getCCompiler = () => context.globalState.get<string>('c_compiler_choice', 'gcc');

    // التحقق من نظام التشغيل لتوحيد بيئة العمل
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
            // استخدام المترجم الذي اختاره المستخدم
            compiler = getCCompiler();
        } else {
            vscode.window.showErrorMessage('Unsupported file extension!');
            return;
        }

        await document.save();

        // ==========================================
        // إعدادات الملف التنفيذي بناءً على النظام الأساسي
        // ==========================================
        const outFileName = isWindows ? `${fileNameWithoutExt}.exe` : fileNameWithoutExt;
        const runPrefix = isWindows ? `.\\` : `./`;

        const runxName = (fileExt === '.c') ? 'RunX c' : 'RunX c++';

        // ==========================================
        // القائمة المنسدلة
        // ==========================================
        const options = [
            {
                label: `$(zap) ${runxName}`,
                description: `Compile with ${compiler} and run natively`,
                id: 'runx-dynamic'
            },
            {
                label: '$(file-code) Compile to Assembly (AT&T)',
                description: 'Generate .s file',
                id: 'asm-att'
            },
            {
                label: '$(file-binary) Compile to Assembly (Intel)',
                description: 'Generate Intel syntax .s file',
                id: 'asm-intel'
            }
        ];

        
        if (!isWindows) {
            options.push({
                label: '$(terminal-cmd) Compile to Windows & Run (Wine)',
                description: 'Cross-compile via MinGW and execute with Wine',
                id: 'runx-wine'
            });
        }

        const selection = await vscode.window.showQuickPick(options, {
            placeHolder: 'Select a build/run option...'
        });

        if (selection) {
            const terminalName = 'C/C++ RunX';
            let terminal = vscode.window.terminals.find(t => t.name === terminalName);
            if (!terminal) {
                terminal = vscode.window.createTerminal(terminalName);
            }
            terminal.show();

            const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

            if (selection.id === 'runx-dynamic') {
                terminal.sendText(`cd "${dirPath}"`);
                await sleep(100);
                terminal.sendText(`${compiler} "${fileName}" -o "${outFileName}"`);
                await sleep(100);
                terminal.sendText(`${runPrefix}"${outFileName}"`);
                
            } else if (selection.id === 'asm-att') {
                terminal.sendText(`cd "${dirPath}"`);
                await sleep(100);
                terminal.sendText(`${compiler} -S "${fileName}"`);
                
            } else if (selection.id === 'asm-intel') {
                terminal.sendText(`cd "${dirPath}"`);
                await sleep(100);
                terminal.sendText(`${compiler} -S -masm=intel -fverbose-asm "${fileName}"`);
                
            } else if (selection.id === 'runx-wine') {
                // منطق الترجمة والتشغيل لبيئة ويندوز الوهمية
                const crossCompiler = (fileExt === '.c') ? 'x86_64-w64-mingw32-gcc' : 'x86_64-w64-mingw32-g++';
                const exeName = `${fileNameWithoutExt}.exe`;
                
                terminal.sendText(`cd "${dirPath}"`);
                await sleep(100);
                
                terminal.sendText(`${crossCompiler} "${fileName}" -o "${exeName}" -static`);
                await sleep(100);
                
                terminal.sendText(`WINEDEBUG=-all wine "${exeName}"`);
            }
        }
    });

    context.subscriptions.push(disposable);


    // الأمر الخاص بالزر الثاني (قائمة الإعدادات وتغيير المترجم)
    // ==========================================
    const testMenuDisposable = vscode.commands.registerCommand('c-cpp-runx.showTestMenu', async () => {
        
        const currentCompiler = getCCompiler();

        const mainOptions = [
            { 
                label: '$(gear) change c compiler', 
                description: `Current: ${currentCompiler}`, 
                id: 'change_compiler' 
            }
        ];

        const selection = await vscode.window.showQuickPick(mainOptions, {
            placeHolder: 'Settings'
        });

        if (selection && selection.id === 'change_compiler') {
            const subOptions = [
                { label: 'gcc', description: 'Use GNU Compiler Collection' },
                { label: 'tcc', description: 'Use Tiny C Compiler' }
            ];

            const subSelection = await vscode.window.showQuickPick(subOptions, {
                placeHolder: 'Select a C Compiler'
            });

            if (subSelection) {
                // حفظ المترجم المختار في الـ globalState
                await context.globalState.update('c_compiler_choice', subSelection.label);
                vscode.window.showInformationMessage(`C Compiler successfully changed to: ${subSelection.label}`);
            }
        }
    });

    context.subscriptions.push(testMenuDisposable);

    const runCDisposable = vscode.commands.registerCommand('c-cpp-runx.runC', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
        const dirPath = path.dirname(document.fileName);
        const fileName = path.basename(document.fileName);
        const fileNameWithoutExt = path.basename(document.fileName, path.extname(document.fileName));

        const outFileName = isWindows ? `${fileNameWithoutExt}.exe` : fileNameWithoutExt;
        const runPrefix = isWindows ? `.\\` : `./`;

        await document.save();

        const terminalName = 'C/C++ RunX';
        let terminal = vscode.window.terminals.find(t => t.name === terminalName);
        if (!terminal) {
            terminal = vscode.window.createTerminal(terminalName);
        }
        terminal.show();

        // سحب المترجم المختار
        const compiler = getCCompiler();

        const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
        terminal.sendText(`cd "${dirPath}"`);
        await sleep(100);
        terminal.sendText(`${compiler} "${fileName}" -o "${outFileName}"`);
        await sleep(100);
        terminal.sendText(`${runPrefix}"${outFileName}"`);
    });

    
    const runCppDisposable = vscode.commands.registerCommand('c-cpp-runx.runCpp', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
        const dirPath = path.dirname(document.fileName);
        const fileName = path.basename(document.fileName);
        const fileNameWithoutExt = path.basename(document.fileName, path.extname(document.fileName));

        const outFileName = isWindows ? `${fileNameWithoutExt}.exe` : fileNameWithoutExt;
        const runPrefix = isWindows ? `.\\` : `./`;

        await document.save();

        const terminalName = 'C/C++ RunX';
        let terminal = vscode.window.terminals.find(t => t.name === terminalName);
        if (!terminal) {
            terminal = vscode.window.createTerminal(terminalName);
        }
        terminal.show();

        const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
        terminal.sendText(`cd "${dirPath}"`);
        await sleep(100);
        terminal.sendText(`g++ "${fileName}" -o "${outFileName}"`);
        await sleep(100);
        terminal.sendText(`${runPrefix}"${outFileName}"`);
    });

    context.subscriptions.push(runCDisposable, runCppDisposable);
}

export function deactivate() {}

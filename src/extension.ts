import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

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
            compiler = 'gcc';
        } else {
            vscode.window.showErrorMessage('Unsupported file extension!');
            return;
        }

        await document.save();

        // ==========================================
        // خيار RunX c أو RunX c++ في القائمة المنسدلة
        // ==========================================
        const runxName = (fileExt === '.c') ? 'RunX c' : 'RunX c++';

        const options = [
            {
                label: `$(zap) ${runxName}`,
                description: `Compile with ${compiler} and run`,
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
                terminal.sendText(`${compiler} "${fileName}" -o "${fileNameWithoutExt}"`);
                await sleep(100);
                terminal.sendText(`./"${fileNameWithoutExt}"`);
                
            } else if (selection.id === 'asm-att') {
                terminal.sendText(`cd "${dirPath}"`);
                await sleep(100);
                terminal.sendText(`${compiler} -S "${fileName}"`);
                
            } else if (selection.id === 'asm-intel') {
                terminal.sendText(`cd "${dirPath}"`);
                await sleep(100);
                terminal.sendText(`${compiler} -S -masm=intel -fverbose-asm "${fileName}"`);
                
            }
        }
    });

    context.subscriptions.push(disposable);

    // ==========================================
    // الأمر الخاص بالزر الثاني (حرف i)
    // ==========================================
    const testMenuDisposable = vscode.commands.registerCommand('c-cpp-runx.showTestMenu', async () => {
        
        const mainOptions = [
            { label: 'test', description: 'Open test options', id: 'test_main' }
        ];

        const selection = await vscode.window.showQuickPick(mainOptions, {
            placeHolder: 'Settings & Tests'
        });

        if (selection && selection.id === 'test_main') {
            const subOptions = [
                { label: 'test 1', description: '' },
                { label: 'test 2', description: '' }
            ];

            const subSelection = await vscode.window.showQuickPick(subOptions, {
                placeHolder: 'Select an option'
            });

            if (subSelection) {
                return; 
            }
        }
    });

    context.subscriptions.push(testMenuDisposable);
}

export function deactivate() {}

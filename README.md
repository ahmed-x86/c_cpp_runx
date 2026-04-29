# C/C++ RunX

**Version:** 1.0.5

The ultimate **C/C++ runner** and **C/C++ compiler** extension for VS Code. Whether you are looking to **compile C**, **run C++**, or execute code instantly, C/C++ RunX is your go-to **code runner**. Featuring seamless integration with **GCC**, **G++**, and **TCC** (Tiny C Compiler), it provides the fastest way to build, execute, and generate **Assembly** directly from your source files across Windows, Linux, and macOS.

---

## 🌟 Features

* **Quick Execution:** Instantly **run C** and **run C++** files effortlessly with a single click or shortcut.
* **Cross-Platform:** Smartly detects your operating system (Windows, Linux, macOS) to handle executable extensions (e.g., `.exe`) and execution paths (`.\` vs `./`) automatically.
* **Compile Options:** 
  * Standard compilation and execution (RunX).
  * Generate Assembly code (.s file) in **AT&T** syntax.
  * Generate Assembly code (.s file) in **Intel** syntax (with `fverbose-asm` for annotated code).
* **Compiler Selection:** Easily switch your active C compiler between `gcc` (default) and `tcc`. The extension automatically remembers your choice globally across all your workspaces.
* **Auto-Save:** Automatically saves your active document before compiling to ensure you are always running the latest code.
* **Clean Terminal:** Executes all commands in a dedicated, reusable integrated terminal named `C/C++ RunX`.

---

## 🛠️ Requirements

For the extension to work properly, you must have the following compilers installed and added to your system's environment variable (PATH):
* **C++:** `g++` compiler (typically comes with the GCC or MinGW toolchain).
* **C:** `gcc` or `tcc` (Tiny C Compiler), depending on your selected preference in the extension settings.

---

## 🚀 Usage

The extension provides several commands accessible via the **Command Palette** (`Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on macOS):

1. **`C/C++ RunX: Show Menu`**
   * Opens the main quick pick menu with options to run the file or generate Assembly code.
   * **Shortcut:** `Ctrl + Alt + C` (or `Cmd + Alt + C` on Mac).

2. **`C/C++ RunX: Settings (Change C Compiler)`**
   * Opens the settings menu allowing you to switch the active C compiler between `gcc` and `tcc`. Your selection is saved persistently.

3. **Direct Run Commands:**
   * **`C/C++ RunX: Run C`**: Immediately compiles and runs the active C file using your selected compiler.
   * **`C/C++ RunX: Run C++`**: Immediately compiles and runs the active C++ file using `g++`.

> **Tip:** You can bind the direct run commands to custom Keyboard Shortcuts to further speed up your workflow!

---

## 📝 Release Notes

### 1.0.5
* **Complete Windows Support:** The extension now smartly detects `win32` environments. It accurately generates `.exe` output files and executes them using the proper PowerShell/CMD syntax (`.\`), resolving previous pathing issues.
* **FOSS License Added:** Officially licensed under the **GNU General Public License v3.0 (GPL-3.0)**, embracing the free and open-source software philosophy.

### 1.0.4
* **Extreme Optimization:** Compressed extension icon (`icon.png`), reducing the VSIX footprint significantly for lightning-fast downloads.
* **SEO & Discoverability:** Improved Marketplace metadata so you can find the best C/C++ runner faster.
* Added default keybinding (`Ctrl+Alt+C`) to quickly summon the Build & Run menu.

### 1.0.3
* **Added Settings Menu:** You can now change your preferred C compiler dynamically between `gcc` and `tcc`.
* **Global State Support:** The extension now permanently remembers your compiler choice even after restarting VS Code.
* General stability improvements and code refactoring.

---

## 📜 License

This extension is Free and Open Source Software (FOSS). It is licensed under the **[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html)**. You are free to redistribute and/or modify it under the terms of this license.

---

**Built with by ahmed-x86 to simplify C/C++ development** 🚀
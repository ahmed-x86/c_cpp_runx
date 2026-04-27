# C/C++ RunX

**Version:** 1.0.3

A lightweight and fast VS Code extension that allows you to seamlessly compile and run **C** and **C++** files. It also provides advanced options for generating Assembly code and selecting your preferred C compiler.

---

## 🌟 Features

* **Quick Execution:** Compile and run `.c` and `.cpp` files effortlessly.
* **Compile Options:** * Standard compilation and execution (RunX).
  * Generate Assembly code (.s file) in **AT&T** syntax.
  * Generate Assembly code (.s file) in **Intel** syntax (with `fverbose-asm` for annotated code).
* **Compiler Selection [New in 1.0.3]:** You can now easily switch between `gcc` (default) and `tcc` for compiling C files. The extension automatically remembers your choice globally across all your workspaces.
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

2. **`C/C++ RunX: Settings (Change C Compiler)`**
   * Opens the settings menu allowing you to switch the active C compiler between `gcc` and `tcc`. Your selection is saved persistently.

3. **Direct Run Commands:**
   * **`C/C++ RunX: Run C`**: Immediately compiles and runs the active C file using your selected compiler.
   * **`C/C++ RunX: Run C++`**: Immediately compiles and runs the active C++ file using `g++`.

> **Tip:** You can bind these commands to custom Keyboard Shortcuts to speed up your workflow!

---

## 📝 Release Notes

### 1.0.3
* **Added Settings Menu:** You can now change your preferred C compiler dynamically between `gcc` and `tcc`.
* **Global State Support:** The extension now permanently remembers your compiler choice even after restarting VS Code.
* General stability improvements and code refactoring.

---

**Built with ❤️ to simplify C/C++ development** 🚀
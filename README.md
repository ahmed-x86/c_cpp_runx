# C/C++ RunX

**Version:** 1.0.7

The ultimate **C/C++ runner** and **C/C++ compiler** extension for VS Code. Whether you are looking to **compile C**, **run C++**, or execute code instantly, C/C++ RunX is your go-to **code runner**. Featuring seamless integration with **GCC**, **G++**, and **TCC** (Tiny C Compiler), it provides the fastest way to build, execute, and generate **Assembly** directly from your source files across Windows, Linux, and macOS.

---

## 🌟 Features

* **Quick Execution:** Instantly **run C** and **run C++** files effortlessly with a single click or shortcut.
* **Smart Snippets:** Includes ready-to-use templates for C/C++ Hello World and advanced Windows/Unix `fstream` examples to speed up your coding workflow.
* **Cross-Platform:** Smartly detects your operating system (Windows, Linux, macOS) to handle executable extensions (e.g., `.exe`) and execution paths (`.\` vs `./`) automatically.
* **Cross-Compile & Simulate (Linux/Mac):** Instantly compile your C/C++ code to a Windows executable (`.exe`) using MinGW and run it seamlessly via Wine. Perfect for testing Windows-specific file paths (`C:\\...`) and I/O streams (`fstream`) without leaving your Unix environment.
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
* **C:** `gcc` or `tcc` (Tiny C Compiler).
* **Windows Simulation (Linux/Mac only):** `mingw-w64` (for `x86_64-w64-mingw32-gcc/g++`) and `wine` must be installed to use the Cross-Compile feature.

---

## 🚀 Usage

### 1. Commands & Shortcuts
* **`C/C++ RunX: Show Menu`**: Opens the build/run menu (`Ctrl + Alt + C` / `Cmd + Alt + C`).
* **`C/C++ RunX: Settings`**: Switch the active C compiler.
* **`Direct Run`**: Direct commands for `Run C` and `Run C++`.

### 2. Built-in Snippets
Just type the prefix in a `.c` or `.cpp` file and hit `Tab`:
* `hello_world_c`: Generates a standard C Hello World.
* `hello_world_c++`: Generates a standard C++ Hello World.
* `fstream_c++_windows`: Generates a C++ file handling template with Windows paths (`C:\\...`).
* `fstream_c++_unix`: Generates a C++ file handling template with Unix paths (`/tmp/...`).

---

## 📝 Release Notes

### 1.0.7
* **Added Code Snippets:** Introduced professional templates for C, C++, and `fstream` (Windows/Unix versions) to help students and developers get started faster.
* **Metadata Update:** Optimized extension manifest for better performance and discovery.

### 1.0.6
* **Windows Cross-Compilation & Simulation:** Added "Compile to Windows & Run (Wine)" exclusively for Linux and macOS.
* **Optimized Wine Execution:** Commands now use `-static` linking and `env -u DISPLAY` to ensure a clean, error-free terminal output on Arch and other distros.

### 1.0.5
* **Complete Windows Support:** Smart detection of `win32` environments and `.exe` pathing.
* **FOSS License:** Officially licensed under **GNU GPL-3.0**.

---

## 📜 License

This extension is Free and Open Source Software (FOSS). It is licensed under the **[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html)**.

---

**Built with by ahmed-x86 to simplify C/C++ development** 🚀
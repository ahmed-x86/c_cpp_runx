# C/C++ RunX

**Version:** 1.1.0

The ultimate **C/C++ runner** and **C/C++ compiler** extension for VS Code. Whether you are looking to **compile C**, **run C++**, or execute code instantly, C/C++ RunX is your go-to **code runner**. Featuring seamless integration with **GCC**, **G++**, and **TCC** (Tiny C Compiler), it provides the fastest way to build, execute, and generate **Assembly** directly from your source files across Windows, GNU/Linux, and macOS.

---

## 🌟 Features

* **Quick Execution:** Instantly **run C** and **run C++** files effortlessly with a single click or shortcut.
* **Smart Syntax Checking:** Automatically checks C/C++ syntax in the background before execution. If errors are found, it highlights the exact word with red squiggles and inline gutter markers, keeping your terminal perfectly clean!
* **Build Profiles (New!):** Easily switch between **Normal** and **Release (-O3 -s)** build modes. Instantly generate highly optimized, lightweight executables without writing complex Makefiles.
* **Smart Snippets:** Includes ready-to-use templates for C/C++ Hello World and advanced Windows/Unix `fstream` examples to speed up your coding workflow.
* **Cross-Platform:** Smartly detects your operating system (Windows, GNU/Linux, macOS) to handle executable extensions (e.g., `.exe`) and execution paths (`.\` vs `./`) automatically.
* **Cross-Compile & Simulate (GNU/Linux & Mac):** Instantly compile your C/C++ code to a Windows executable (`.exe`) using MinGW and run it seamlessly via Wine. Perfect for testing Windows-specific file paths (`C:\\...`) and I/O streams (`fstream`) without leaving your Unix environment.
* **Compile Options:** * Standard compilation and execution (RunX).
  * Generate Assembly code (.s file) in **AT&T** syntax.
  * Generate Assembly code (.s file) in **Intel** syntax (with `fverbose-asm` for annotated code).
* **Settings & Customization:** Switch your active C compiler (`gcc` or `tcc`), set your Build Profile, and toggle **Wine logs (ON/OFF)** for cleaner terminal output. The extension automatically remembers your choices globally across all your workspaces.
* **Auto-Save:** Automatically saves your active document before compiling to ensure you are always running the latest code.
* **Clean Terminal:** Executes all commands in a dedicated, reusable integrated terminal named `C/C++ RunX`.

---

## 🛠️ Requirements

For the extension to work properly, you must have the following compilers installed and added to your system's environment variable (PATH):
* **C++:** `g++` compiler (typically comes with the GCC or MinGW toolchain).
* **C:** `gcc` or `tcc` (Tiny C Compiler).
* **Windows Simulation (GNU/Linux & Mac only):** `mingw-w64` (for `x86_64-w64-mingw32-gcc/g++`) and `wine` must be installed to use the Cross-Compile feature.

---

## 🚀 Usage

### 1. Commands & Shortcuts
* **`C/C++ RunX: Show Menu`**: Opens the build/run menu (`Ctrl + Alt + C` / `Cmd + Alt + C`).
* **`C/C++ RunX: Settings`**: Switch the active C compiler, change the Build Profile, and toggle Wine logs.
* **`Direct Run`**: Direct commands for `Run C` and `Run C++`.

### 2. Built-in Snippets
Just type the prefix in a `.c` or `.cpp` file and hit `Tab`:
* `hello_world_c`: Generates a standard C Hello World.
* `hello_world_c++`: Generates a standard C++ Hello World.
* `fstream_c++_windows`: Generates a C++ file handling template with Windows paths (`C:\\...`).
* `fstream_c++_unix`: Generates a C++ file handling template with Unix paths (`/tmp/...`).

---

## 📝 Release Notes

### 1.1.0
* **Introduced Build Profiles:** Added a powerful new setting to switch between "Normal" and "Release" builds. Selecting "Release" automatically applies `-O3` (maximum optimization) and `-s` (strip symbols) flags to your compilation commands. This allows developers to instantly create blazingly fast, production-ready executables directly from the menu.

### 1.0.9
* **Smart Background Diagnostics:** The extension now performs a lightning-fast background syntax check (using `-fsyntax-only` for GCC/G++) before execution.
* **Visual Error Tracking:** Compilation errors are now caught early and highlighted precisely in your editor with red squiggles and gutter icons, preventing terminal spam and making debugging a breeze!

### 1.0.8
* **Wine Logs Toggle:** Added a new option in the `RunX Settings` menu to turn Wine debugging logs ON or OFF. This allows for a much cleaner terminal output by hiding standard Wine warnings/errors when simulating Windows executables on GNU/Linux or macOS.

### 1.0.7
* **Added Code Snippets:** Introduced professional templates for C, C++, and `fstream` (Windows/Unix versions) to help students and developers get started faster.
* **Metadata Update:** Optimized extension manifest for better performance and discovery.

### 1.0.6
* **Windows Cross-Compilation & Simulation:** Added "Compile to Windows & Run (Wine)" exclusively for GNU/Linux and macOS.
* **Optimized Wine Execution:** Commands now use `-static` linking and `env -u DISPLAY` to ensure a clean, error-free terminal output on Arch and other distros.

### 1.0.5
* **Complete Windows Support:** Smart detection of `win32` environments and `.exe` pathing.
* **FOSS License:** Officially licensed under **GNU GPL-3.0**.

---

## 📜 License

This extension is Free and Open Source Software (FOSS). It is licensed under the **[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html)**.

---

**Built with by ahmed-x86 to simplify C/C++ development** 🚀
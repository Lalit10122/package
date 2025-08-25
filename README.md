# Terminal Pattern Printer

A lightweight Node.js package for printing beautiful patterns and names in ASCII art using asterisks (*) in the terminal.

## 📦 Installation

```bash
npm install terminal-pattern
```


## 🚀 Quick Start

```javascript
const patternPrinter = require('terminal-pattern');

// Print a simple pattern
patternPrinter.printTrinangle('hollow', 5);

// Print your name in ASCII art
patternPrinter.printName('JOHN');
```


## ✨ Features

- 🎨 Multiple pattern types (triangle, square, diamond, pyramid)
- 📝 Convert text/names to ASCII art using asterisks
- 🎯 Customizable pattern sizes
- 🎪 Colorful terminal output support
- 📱 Cross-platform compatibility (Windows, macOS, Linux)
- ⚡ Lightweight with no external dependencies


## 📖 Usage Examples

### Pattern Printing

```javascript
const { printTriangle } = require('terminal-pattern');

// Print a triangle pattern
printTriangle('solid', 5);
/*
    *
   ***
  *****
 *******
*********
*/




### Name/Text Printing

```javascript
const { printName } = require('terminal-pattern');

// Print name in ASCII art
printName('HELLO');
/*
**   ** ******* **      **      *******
**   ** **      **      **      **   **
******* ******* **      **      **   **
**   ** **      **      **      **   **
**   ** ******* ******* ******* *******
*/

// Print with custom options
printName(name = "LALIT", size = 9, thickness = 1, gap = 2)
```


## 🛠️ API Reference

### `printPattern(type, size)`

Prints a pattern in the terminal.

**Parameters:**

- `type` (string): Pattern type - 'hollow', 'solid', 
- `size` (number): Size of the pattern
- 


### `printName(name, size, thickness, gap)`

Prints text as ASCII art in the terminal.

**Parameters:**

- `name` (string): Text to convert to ASCII art




## 📋 Examples

```javascript
const printer = require('terminal-pattern');

// Different patterns
printer.printPattern('triangle', 6);
printer.printPattern('square', 8);
printer.printPattern('diamond', 4);

// Colored output
printer.printName('NODEJS', { color: 'green' });
printer.printPattern('triangle', 5, { color: 'blue' });

// Custom characters
printer.printName('REACT', { character: '#', color: 'cyan' });
```


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Lalit Patharia**

- GitHub: (https://github.com/Lalit10122)
- npm: (https://www.npmjs.com/~lalit01)


## 🔗 Links

- [npm package](https://www.npmjs.com/package/terminal-pattern)
- [GitHub repository](https://github.com/Lalit10122/package)
- [Report Issues](https://github.com/Lalit10122/package/issues)


## 📊 Stats


***

⭐ If you found this package helpful, please consider giving it a star on GitHub!


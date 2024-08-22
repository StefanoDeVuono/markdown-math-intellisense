# VSCode Markdown Math Intellisense Extension

## Overview

This VSCode extension provides specialized support for working with LaTeX embedded in markdown files. It offers intelligent autocompletion and handles virtual documents to enhance your editing experience.

## Features

1. **Intelligent Autocompletion**:
   - James-Yu's LaTeX-Workshop provides robust autocompletion feature that triggers suggestions within math blocks based on specific characters. By defaul, these include `\\`, `.`, `:`, and a user-defined LaTeX trigger. This is particularly useful for users working with LaTeX while in markdown speeding up note taking for mathy subjects.

## Usage

1. **Activating the Extension**:
   - The extension activates automatically when VSCode starts, registering the necessary providers to manage virtual documents and autocompletion.

2. **Customizing Autocompletion**:
   - Users can configure the LaTeX autocompletion trigger through the `latex-workshop` settings in VSCode. This allows for a customized experience tailored to your specific needs.

## Configuration

- **LaTeX Autocompletion Trigger**:
  - The trigger for LaTeX autocompletion can be customized in the VSCode settings under `latex-workshop`. This allows you to define which characters should trigger suggestions.

## Requirements

- This extension requires [James-Yu's LaTeX-Workshop extension](https://github.com/James-Yu/LaTeX-Workshop/blob/master/package.json).

## Installation

To install the extension, download it from the [VSCode marketplace](https://marketplace.visualstudio.com/). The extension will activate automatically, providing the features described above.

## Contribution

Feel free to contribute to the development of this extension. Fork the repository, make your changes, and submit a pull request. To set up the development environment:

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Open the project in VSCode and start debugging.

## License

This project is licensed under the MIT Licence.

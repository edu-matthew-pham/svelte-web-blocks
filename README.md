# svelte-web-blocks
An Open Source Implementation of Svelte Components for Web Development using Google Blockly

## Description
This project provides Svelte components for visual programming using Google Blockly. It allows developers to create block-based programming interfaces within Svelte applications, making it easier to implement visual programming features in your web projects.

## Features
- 🔌 Seamless Blockly integration with Svelte
- 🧩 Custom block definitions and toolbox configuration
- 📝 Code generation for multiple languages
- 🎨 Customizable workspace themes
- 📱 Responsive design and mobile support
- 💡 Multiple examples showcasing different use cases:
  - Basic Blockly implementation
  - JSON to Blocks conversion
  - HTML to PUG transformation
  - Blockly to JSON export

## Installation

```bash
npm install svelte-web-blocks
```

## Quick Start

```javascript
<script>
  import { BlocklyWorkspace } from 'svelte-web-blocks';
</script>

<BlocklyWorkspace 
  toolbox={yourToolboxConfig}
  workspaceOptions={yourOptions}
/>
```

## Documentation

For detailed documentation and examples, visit our [documentation page](#).

## Examples

This package includes several example components demonstrating different use cases:

- `BasicBlockly.svelte`: Simple Blockly workspace setup
- `JsonToBlocks.svelte`: Convert JSON structures to Blockly blocks
- `HtmlToPug.svelte`: Transform HTML to PUG using visual blocks
- `BlocklyToJson.svelte`: Export Blockly workspace to JSON

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Google Blockly](https://developers.google.com/blockly)
- [Svelte](https://svelte.dev/)
- All contributors who help improve this project
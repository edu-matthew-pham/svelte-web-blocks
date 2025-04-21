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

## Usage

### Basic Example

```javascript
<script>
  import { BlocklyWorkspaceWithPreview } from 'svelte-web-blocks';
  
  // Variables to store generated code
  let htmlOutput = '';
  let jsonOutput = '';
</script>

<BlocklyWorkspaceWithPreview 
  bind:generatedHtml={htmlOutput}
  bind:generatedJson={jsonOutput}
/>
```

### With JSON Utility Buttons
```javascript
<script>
  import { BlocklyWorkspaceWithPreview } from 'svelte-web-blocks';
  
  // Variables to store generated code
  let htmlOutput = '';
  let jsonOutput = '';
  
  // Function to log JSON to console
  function logJson() {
    console.log(JSON.parse(jsonOutput));
  }
  
  // Function to download JSON
  function downloadJson() {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blockly-workspace.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<div class="workspace-container">
  <BlocklyWorkspaceWithPreview 
    bind:generatedHtml={htmlOutput}
    bind:generatedJson={jsonOutput}
  />
</div>

<div class="json-actions">
  <button on:click={logJson}>Log JSON to Console</button>
  <button on:click={downloadJson}>Download JSON</button>
</div>
```

## Examples

This package includes several example components demonstrating different use cases:

- `QuickStart.svelte`: Simple Blockly workspace setup
- `BasicBlockly.svelte`: Convert Blockly to HTML
- `BlocklyToJson.svelte`: Convert Blockly to JSON
- `JsonToBlocks.svelte`: Convert JSON structures to Blockly blocks
- `HtmlToPug.svelte`: Transform HTML to PUG

You can view a live deployment of these examples [here](https://svelte-web-blocks.vercel.app/).

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
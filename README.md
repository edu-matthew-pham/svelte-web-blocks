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
- 🔍 Live preview of generated code
- 📊 DOM inspection and visualization
- 🔄 Bidirectional JSON conversion

## Installation

```bash
npm install svelte-web-blocks
```

## Usage

### Basic Example with BlocklyEditor

```javascript
<script>
  import { BlocklyEditor } from 'svelte-web-blocks';
  
  let editor;
  let jsonOutput = '';
  
  function handleEditorChange(event) {
    if (event.detail && event.detail.json) {
      jsonOutput = event.detail.json;
    }
  }
  
  function clearWorkspace() {
    if (editor) {
      editor.clearWorkspace();
    }
  }
</script>

<div class="editor-container" style="height: 600px;">
  <BlocklyEditor 
    bind:this={editor}
    showCodeView={true}
    showJsonView={true}
    on:change={handleEditorChange}
  />
</div>

<div class="controls">
  <button on:click={clearWorkspace}>Clear Workspace</button>
</div>
```

### Loading from JSON

```javascript
<script>
  import { BlocklyEditor } from 'svelte-web-blocks';
  
  let editor;
  let jsonInput = `[
    {
      "type": "document",
      "properties": {
        "title": "My Web Page"
      },
      "children": [
        {
          "type": "heading",
          "properties": {
            "text": "Hello World"
          }
        }
      ]
    }
  ]`;
  
  function loadJson() {
    if (editor && jsonInput) {
      editor.loadFromJson(jsonInput);
    }
  }
</script>

<div class="editor-container" style="height: 600px;">
  <BlocklyEditor bind:this={editor} />
</div>

<div class="json-input">
  <textarea bind:value={jsonInput} rows="10"></textarea>
  <button on:click={loadJson}>Load from JSON</button>
</div>
```

## Key Components

### Main Components

- **BlocklyEditor**: Full-featured editor with tabs for Blocks, JSON, HTML, Preview, and DOM inspection
- **BlocklyWorkspace**: Simple Blockly workspace without preview
- **BlocklyWorkspaceWithPreview**: Workspace with HTML preview functionality

### Example Components

- **BasicBlockly**: Simple implementation showing HTML generation from blocks
- **BlocklyToJson**: Demonstrates how to convert Blockly workspace to JSON
- **JsonToBlocks**: Shows conversion from JSON structures to Blockly blocks
- **HtmlToPug**: Provides transformation from HTML to PUG format

### Utility Functions

- `createBlocksFromJson`: Convert JSON to Blockly blocks
- `convertHTMLToPug`: Transform HTML to PUG format
- `initializeBlocks`: Load all block definitions and generators

## Example Use Cases

This package supports various workflows:

- Creating web components visually with blocks
- Converting JSON specifications to visual blocks
- Generating HTML code from blocks
- Transforming HTML to PUG
- Live previewing generated components
- Inspecting the DOM structure of components

### Quick Integration Guide

1. **Basic HTML Generation**
   ```javascript
   <script>
     import { BasicBlockly } from 'svelte-web-blocks';
   </script>
   
   <BasicBlockly />
   ```

2. **JSON Generation**
   ```javascript
   <script>
     import { BlocklyToJson } from 'svelte-web-blocks';
   </script>
   
   <BlocklyToJson />
   ```

3. **JSON to Blocks Conversion**
   ```javascript
   <script>
     import { JsonToBlocks } from 'svelte-web-blocks';
   </script>
   
   <JsonToBlocks />
   ```

4. **HTML to PUG Conversion**
   ```javascript
   <script>
     import { HtmlToPug } from 'svelte-web-blocks';
   </script>
   
   <HtmlToPug />
   ```

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
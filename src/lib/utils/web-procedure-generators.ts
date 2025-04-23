import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Store original generators
const originalDefNoReturnGenerator = javascriptGenerator.forBlock['procedures_defnoreturn'];
const originalDefReturnGenerator = javascriptGenerator.forBlock['procedures_defreturn'];
const originalCallNoReturnGenerator = javascriptGenerator.forBlock['procedures_callnoreturn'];
const originalCallReturnGenerator = javascriptGenerator.forBlock['procedures_callreturn'];

// Override generators with web-component-aware versions
function initializeWebProcedureGenerators() {
  // For procedure definition blocks, we need to wrap their output in appropriate web component context
  javascriptGenerator.forBlock['procedures_defnoreturn'] = function(block) {
    // Get the original generated code
    const code = originalDefNoReturnGenerator.call(this, block);
    
    // Wrap or modify it as needed for web components
    // For example, you might need to wrap it in a specific way or modify its structure
    return `<!-- Web Component Function -->\n${code}\n<!-- End Web Component Function -->`;
  };
  
  // Similar for other procedure blocks...
  javascriptGenerator.forBlock['procedures_defreturn'] = function(block) {
    const code = originalDefReturnGenerator.call(this, block);
    return `<!-- Web Component Function with Return -->\n${code}\n<!-- End Web Component Function -->`;
  };
  
  // For procedure calls, adjust as needed
  javascriptGenerator.forBlock['procedures_callnoreturn'] = function(block) {
    const code = originalCallNoReturnGenerator.call(this, block);
    return `<!-- Calling Web Function -->\n${code}\n<!-- End Call -->`;
  };
}

export { initializeWebProcedureGenerators };
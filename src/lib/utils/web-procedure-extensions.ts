import * as Blockly from 'blockly';

// Register an extension that makes blocks compatible with web content blocks
Blockly.Extensions.register('web_content_compatible', function() {
  // Modify the connections to be compatible with web_content_block
  this.setPreviousStatement(true, "web_component");
  this.setNextStatement(true, "web_component");
});

// Register an extension for procedure_defreturn blocks (which have return values)
Blockly.Extensions.register('web_content_compatible_with_return', function() {
  // For blocks with return values, we need to handle them slightly differently
  // Typically these have output connections rather than next/previous statements
  this.setOutput(false); // Remove any output connection
  this.setPreviousStatement(true, "web_component");
  this.setNextStatement(true, "web_component");
});

// Apply the extensions to the procedure blocks
function applyWebCompatibilityToProcedureBlocks() {
  // Get original init functions
  const defNoReturnInit = Blockly.Blocks['procedures_defnoreturn'].init;
  const defReturnInit = Blockly.Blocks['procedures_defreturn'].init;
  const callNoReturnInit = Blockly.Blocks['procedures_callnoreturn'].init;
  const callReturnInit = Blockly.Blocks['procedures_callreturn'].init;

  // Override init functions to apply our extensions
  Blockly.Blocks['procedures_defnoreturn'].init = function() {
    defNoReturnInit.call(this);
    Blockly.Extensions.apply('web_content_compatible', this, false);
  };

  Blockly.Blocks['procedures_defreturn'].init = function() {
    defReturnInit.call(this);
    Blockly.Extensions.apply('web_content_compatible_with_return', this, false);
  };

  Blockly.Blocks['procedures_callnoreturn'].init = function() {
    callNoReturnInit.call(this);
    Blockly.Extensions.apply('web_content_compatible', this, false);
  };

  // For procedures_callreturn, we need to keep its output connection
  // but make it compatible with web components when used in a statement context
  Blockly.Blocks['procedures_callreturn'].init = function() {
    callReturnInit.call(this);
    // Since this block has an output connection, we generally don't modify it
    // However, if needed for your specific use case, you could set the output type
    // this.setOutput(true, ["String", "Number", "Boolean"]); // Example output types
  };
}

export { applyWebCompatibilityToProcedureBlocks };
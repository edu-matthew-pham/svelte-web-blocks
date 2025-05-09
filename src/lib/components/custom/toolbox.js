// Auto-generated from toolbox.xml
// Do not edit directly - use the XML file instead

export const toolboxXml = `<category name="Custom Code" colour="230" >
  
  
  <block type="custom_style_css">
    <field name="CODE">/* Add custom CSS styles */
.custom-element {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
}

.custom-element h2 {
  color: #333;
}</field>
  </block>

  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Add custom HTML to the body content -->
&lt;div class="custom-element"&gt;
  &lt;h2&gt;Custom Element&lt;/h2&gt;
  &lt;p&gt;This is custom HTML content.&lt;/p&gt;
&lt;/div&gt;</field>
  </block>
  
  <block type="custom_script_js">
    <field name="CODE">// Add general JavaScript code
function customFunction() {
  console.log('Custom function executed');
  
  // Example: select an element and modify it
  const element = document.querySelector('.custom-element');
  if (element) {
    element.addEventListener('click', function() {
      console.log('Custom element clicked!');
    });
  }
}</field>
  </block>
  
  <block type="custom_onload_js">
    <field name="CODE">// This code runs when the document is fully loaded
console.log('Document ready!');

// Initialize your application
customFunction();

// Setup event listeners
document.getElementById('my-button')?.addEventListener('click', function() {
  // Button click handler
});</field>
  </block>
</category>
`;

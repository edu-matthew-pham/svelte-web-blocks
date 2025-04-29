// Auto-generated from toolbox.xml
// Do not edit directly - use the XML file instead

export const toolboxXml = `<category name="Custom Code" colour="230" >
  <block type="web_custom_html" disabled="true">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Add your custom HTML here -->
<div class="custom-element">
  <h2>Custom Element</h2>
  <p>This is custom HTML content.</p>
</div></field>
  </block>
  <block type="web_custom_css" disabled="true">
    <field name="CODE">/* Add your custom CSS here */
.custom-element {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
}

.custom-element h2 {
  color: #333;
}</field>
  </block>
  <block type="web_custom_js" disabled="true">
    <field name="CODE">// Add your custom JavaScript here
function customFunction() {
  console.log('Custom function executed');
  
  // Example: select an element and modify it
  const element = document.querySelector('.custom-element');
  if (element) {
    element.addEventListener('click', function() {
      alert('Custom element clicked!');
    });
  }
}</field>
  </block>
</category>
`;

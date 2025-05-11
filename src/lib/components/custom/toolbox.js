// Auto-generated from toolbox.xml
// Do not edit directly - use the XML file instead

export const toolboxXml = `<category name="HTML, CSS, JS" colour="230" >
  
  
  <block type="custom_style_css">
    <field name="CODE">/* Simple CSS example */
.box {
  background-color: #eaf2ff;
  padding: 10px;
  border: 1px solid #ccc;
  margin: 10px;
}

.highlight {
  color: #d33;
  font-weight: bold;
}

.button {
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
}</field>
  </block>

  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Basic HTML example -->
&lt;div class="box"&gt;
  &lt;h3&gt;Hello World&lt;/h3&gt;
  &lt;p&gt;This is a &lt;span class="highlight"&gt;simple&lt;/span&gt; HTML example.&lt;/p&gt;
&lt;/div&gt;</field>
  </block>
  
  <block type="custom_script_js">
    <field name="CODE">// Simple JavaScript function example
function greet(name) {
  return "Hello, " + name + "!";
}

// Show current time
function showTime() {
  const now = new Date();
  return now.toLocaleTimeString();
}</field>
  </block>
  
  <block type="custom_onload_js">
    <field name="CODE">// Simple onload example
console.log("Page loaded at: " + new Date().toLocaleTimeString());

// Add a message to the console after 2 seconds
setTimeout(function() {
  console.log("This message appears 2 seconds after page load");
}, 2000);</field>
  </block>

  <block type="web_document">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="TITLE">Custom Web Page</field>
    <field name="THEME">light</field>
    <statement name="STYLES">
      <block type="custom_style_css">
        <field name="CODE">/* Add custom CSS styles */
.custom-element {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.custom-element h2 {
  color: #333;
}

button {
  padding: 8px 15px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3367d6;
}</field>
      </block>
    </statement>
    <statement name="CONTENT">
      <block type="custom_content_html">
        <field name="ID"></field>
        <field name="CLASS"></field>
        <field name="CODE"><!-- Add custom HTML to the body content -->
&lt;div class="custom-element"&gt;
  &lt;h2&gt;Custom Element&lt;/h2&gt;
  &lt;p&gt;This is custom HTML content.&lt;/p&gt;
  &lt;button id="my-button"&gt;Change Color&lt;/button&gt;
&lt;/div&gt;</field>
      </block>
    </statement>
    <statement name="SCRIPTS">
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
    </statement>
    <statement name="ONLOAD">
      <block type="custom_onload_js">
        <field name="CODE">// This code runs when the document is fully loaded
console.log('Document ready!');

// Initialize your application
customFunction();

// Setup event listeners
document.getElementById('my-button')?.addEventListener('click', function() {
  // Get the custom element
  const element = document.querySelector('.custom-element');
  if (element) {
    // Generate a random color
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    // Change the background color
    element.style.backgroundColor = randomColor;
    console.log('Background color changed to', randomColor);
  }
});</field>
      </block>
    </statement>
  </block>
</category>
`;

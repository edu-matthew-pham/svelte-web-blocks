// Auto-generated from toolbox.xml
// Do not edit directly - use the XML file instead

export const toolboxXml = `<category name="Navigation" colour="230">
  <block type="web_header">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="LOGO_TEXT">My Website</field>
    <field name="INCLUDE_SIGNUP">TRUE</field>
  </block>
  <block type="web_nav_item">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="TEXT">Home</field>
    <field name="URL">home.html</field>
  </block>
  
  <!-- Template block that combines header with navigation items -->
  <block type="web_header">
    <field name="ID"></field>
    <field name="CLASS">main-header</field>
    <field name="LOGO_TEXT">My Website</field>
    <field name="INCLUDE_SIGNUP">TRUE</field>
    <statement name="LINKS">
      <block type="web_nav_item">
        <field name="ID"></field>
        <field name="CLASS"></field>
        <field name="TEXT">Home</field>
        <field name="URL">index.html</field>
        <next>
          <block type="web_nav_item">
            <field name="ID"></field>
            <field name="CLASS"></field>
            <field name="TEXT">About</field>
            <field name="URL">about.html</field>
            <next>
              <block type="web_nav_item">
                <field name="ID"></field>
                <field name="CLASS"></field>
                <field name="TEXT">Contact</field>
                <field name="URL">contact.html</field>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</category> `;

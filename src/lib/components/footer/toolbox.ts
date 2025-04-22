// Footer components toolbox definition
export const footerToolbox = `
  <category name="Footer" colour="330">
    <block type="web_footer">
      <field name="ID"></field>
      <field name="CLASS"></field>
      <field name="COPYRIGHT">© 2023 My Company. All Rights Reserved.</field>
      <value name="LINKS">
        <block type="web_footer_link">
          <field name="TEXT">Privacy Policy</field>
          <field name="URL">/privacy</field>
          <next>
            <block type="web_footer_link">
              <field name="TEXT">Terms of Service</field>
              <field name="URL">/terms</field>
              <next>
                <block type="web_footer_link">
                  <field name="TEXT">Contact Us</field>
                  <field name="URL">/contact</field>
                </block>
              </next>
            </block>
          </next>
        </block>
      </value>
    </block>
    <block type="web_footer_link">
      <field name="ID"></field>
      <field name="CLASS"></field>
      <field name="TEXT">About Us</field>
      <field name="URL">/about</field>
    </block>
  </category>
`; 
// Form components toolbox definition
export const formsToolbox = `
  <category name="Forms" colour="60">
    <block type="web_basic_form">
      <field name="TITLE">Contact Us</field>
      <field name="SUBMIT_TEXT">Send</field>
      <value name="FIELDS">
        <block type="web_form_field">
          <field name="LABEL">Name</field>
          <field name="TYPE">text</field>
          <field name="REQUIRED">TRUE</field>
          <field name="OPTIONS">Option 1, Option 2, Option 3</field>
          <next>
            <block type="web_form_field">
              <field name="LABEL">Email</field>
              <field name="TYPE">email</field>
              <field name="REQUIRED">TRUE</field>
              <field name="OPTIONS">Option 1, Option 2, Option 3</field>
              <next>
                <block type="web_form_field">
                  <field name="LABEL">Message</field>
                  <field name="TYPE">textarea</field>
                  <field name="REQUIRED">TRUE</field>
                  <field name="OPTIONS">Option 1, Option 2, Option 3</field>
                </block>
              </next>
            </block>
          </next>
        </block>
      </value>
    </block>
    <block type="web_form_field">
      <field name="LABEL">Phone Number</field>
      <field name="TYPE">tel</field>
      <field name="REQUIRED">FALSE</field>
      <field name="OPTIONS">Option 1, Option 2, Option 3</field>
    </block>
    <block type="web_form_field">
      <field name="LABEL">Select an Option</field>
      <field name="TYPE">select</field>
      <field name="REQUIRED">FALSE</field>
      <field name="OPTIONS">Option 1, Option 2, Option 3</field>
    </block>
  </category>
`; 
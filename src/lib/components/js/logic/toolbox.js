// Auto-generated from toolbox.xml
// Do not edit directly - use the XML file instead

export const toolboxXml = `
 <category name="Logic" colour="210">

    

    <block type="variables_set">
      <value name="VALUE">
        <block type="text">
          <field name="TEXT">abc</field>
        </block>
      </value>
      <next>
            <block type="controls_if">
      <value name="IF0">
        <block type="expression_compare">
          <field name="EXPRESSION">item == "abc"</field>
        </block>
      </value>
      <statement name="DO0">
        <block type="console_log">
          <value name="TEXT">
            <block type="text">
              <field name="TEXT">item is abc</field>
            </block>
          </value>
        </block>
      </next>
    </block>

    <block type="controls_if">
      <value name="IF0">
        <block type="expression_compare">
          <field name="EXPRESSION">1 == 1</field>
        </block>
      </value>
      <statement name="DO0">
        <block type="console_log">
          <value name="TEXT">
            <block type="text">
              <field name="TEXT">action</field>
            </block>
          </value>
        </block>
      </statement>
    </block>

    <block type="expression_compare">
      <field name="EXPRESSION">1==1 && 1<=2</field>
    </block>

</category>`; 
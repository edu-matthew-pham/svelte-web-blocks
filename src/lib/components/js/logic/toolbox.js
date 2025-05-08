// Auto-generated from toolbox.xml
// Do not edit directly - use the XML file instead

export const toolboxXml = `
 <category name="Logic" colour="210">

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
      <field name="EXPRESSION">x > 0 && y < 10</field>
    </block>

    <block type="logic_operation">
      <field name="OP">AND</field>
      <value name="A">
        <block type="logic_boolean">
          <field name="BOOL">TRUE</field>
        </block>
      </value>
      <value name="B">
        <block type="logic_boolean">
          <field name="BOOL">TRUE</field>
        </block>
      </value>
    </block>

    <block type="logic_negate">
      <value name="BOOL">
        <block type="logic_boolean">
          <field name="BOOL">FALSE</field>
        </block>
      </value>
    </block>

    <block type="logic_ternary">
      <value name="IF">
        <block type="logic_boolean">
          <field name="BOOL">TRUE</field>
        </block>
      </value>
      <value name="THEN">
        <block type="text">
          <field name="TEXT">yes</field>
        </block>
      </value>
      <value name="ELSE">
        <block type="text">
          <field name="TEXT">no</field>
        </block>
      </value>
    </block>

    <block type="controls_if"></block>
    <block type="logic_compare">
      <field name="OP">EQ</field>
    </block>
    <block type="logic_operation">
      <field name="OP">AND</field>
    </block>
    <block type="logic_negate"></block>
    <block type="logic_boolean">
      <field name="BOOL">TRUE</field>
    </block>
    <block type="logic_null"></block>
    <block type="logic_ternary"></block>
</category>`; 
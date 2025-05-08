// Auto-generated from toolbox.xml
// Do not edit directly - use the XML file instead

export const toolboxXml = `<category name="Variables & Functions" colour="290">

    <block type="console_log">
      <value name="TEXT">
        <shadow type="text">
          <field name="TEXT">Hello world</field>
        </shadow>
      </value>
    </block>

    <block type="variables_set">
      <field name="VAR">number</field>
      <value name="VALUE">
        <block type="math_number">
          <field name="NUM">123</field>
        </block>
      </value>
      <next>
        <block type="console_log">
          <value name="TEXT">
            <block type="variables_get">
              <field name="VAR" id="control_for_var">i</field>
            </block>
          </value>
        </block>
      </next>
    </block>

    <label text="Variables" web-class="toolboxLabel"></label>

    <button text="Create Variable..." callbackKey="CREATE_VARIABLE"></button>

    
    <block type="variables_set">
      <value name="VALUE">
        <block type="text">
          <field name="TEXT">abc</field>
        </block>
      </value>
      <next>
        <block type="variables_set">
            <value name="VALUE">
            <block type="text">
              <field name="TEXT">xyz</field>
            </block>
          </value>
        </block>
      </next>
    </block>

    <block type="variables_set">
      <value name="VALUE">
        <block type="text">
          <field name="TEXT">abc</field>
        </block>
      </value>
    </block>


    
    <block type="variables_set">
        <field name="VAR">item</field>
    </block>
    <block type="variables_get">
        <field name="VAR" id="control_for_var">i</field>
    </block>

      <label text="Text & Numbers" web-class="toolboxLabel"></label>
      <sep gap="8"></sep>
      <block type="text">
        <field name="TEXT">abc</field>
    </block>
    <block type="text_multiline_js">
        <field name="TEXT">line 1&#10;line 2&#10;line 3</field>
    </block>
    <block type="math_number">
        <field name="NUM">123</field>
    </block>

    <label text="Functions" web-class="toolboxLabel"></label>
    <sep gap="8"></sep>
    
    <block type="procedures_defnoreturn">
        <field name="NAME">myFunction</field>
    </block>
    <block type="procedures_defreturn">
        <field name="NAME">myFunctionWithReturn</field>
    </block>
    <block type="procedures_callnoreturn">
        <field name="NAME">myFunction</field>
    </block>
    <block type="procedures_callreturn">
        <field name="NAME">myFunctionWithReturn</field>
    </block>

    <block type="procedures_ifreturn">
    </block>
</category>
`;

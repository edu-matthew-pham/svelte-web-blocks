// Auto-generated from toolbox.xml
// Do not edit directly - use the XML file instead

export const toolboxXml = `
 <category name="Logic & Loops" colour="210">

    

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

    <block type="controls_forEach">
      <field name="VAR" id="control_foreach_var">item</field>
      <value name="LIST">
        <block type="lists_create_with">
          <mutation items="3"></mutation>
          <value name="ADD0">
            <block type="text">
              <field name="TEXT">apple</field>
            </block>
          </value>
          <value name="ADD1">
            <block type="text">
              <field name="TEXT">banana</field>
            </block>
          </value>
          <value name="ADD2">
            <block type="text">
              <field name="TEXT">orange</field>
            </block>
          </value>
        </block>
      </value>
      <statement name="DO">
        <block type="console_log">
          <value name="TEXT">
            <block type="variables_get">
              <field name="VAR" id="control_foreach_var">item</field>
            </block>
          </value>
        </block>
      </statement>
    </block>

     <block type="variables_set">
      <field name="VAR">i</field>
      <value name="VALUE">
        <block type="math_number">
          <field name="NUM">0</field>
        </block>
      </value>
      <next>
        <block type="controls_whileUntil">
          <field name="MODE">WHILE</field>
          <value name="BOOL">
            <block type="logic_compare">
              <field name="OP">LT</field>
              <value name="A">
                <block type="variables_get">
                  <field name="VAR">i</field>
                </block>
              </value>
              <value name="B">
                <block type="math_number">
                  <field name="NUM">5</field>
                </block>
              </value>
            </block>
          </value>
          <statement name="DO">
            <block type="variables_set">
              <field name="VAR">i</field>
              <value name="VALUE">
                <block type="math_arithmetic">
                  <field name="OP">ADD</field>
                  <value name="A">
                    <block type="variables_get">
                      <field name="VAR">i</field>
                    </block>
                  </value>
                  <value name="B">
                    <block type="math_number">
                      <field name="NUM">1</field>
                    </block>
                  </value>
                </block>
              </value>
              <next>
                <block type="console_log">
                  <value name="TEXT">
                    <block type="variables_get">
                      <field name="VAR">i</field>
                    </block>
                  </value>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </next>
    </block>

    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
      <statement name="DO">
        <block type="console_log">
          <value name="TEXT">
            <block type="text">
              <field name="TEXT">Hello, world!</field>
            </block>
          </value>
        </block>
      </statement>
    </block>

    </block>
    

    
    <block type="controls_for">
      <field name="VAR" id="control_for_var">i</field>
      <value name="FROM">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="TO">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
      <value name="BY">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <statement name="DO">
        <block type="console_log">
          <value name="TEXT">
            <block type="variables_get">
              <field name="VAR" id="control_for_var">i</field>
            </block>
          </value>
          <next>
            <block type="controls_if">
              <value name="IF0">
                <block type="expression_compare">
                  <field name="EXPRESSION">i == 5</field>
                </block>
              </value>
              <statement name="DO0">
                <block type="controls_flow_statements">
                  <field name="FLOW">BREAK</field>
                </block>
              </statement>
            </block>
          </next>
        </block>
      </statement>
    </block>

    

    <block type="controls_whileUntil">
      <field name="MODE">WHILE</field>
    </block>
    
    <block type="controls_forEach">
      <field name="VAR" id="control_foreach_var">item</field>
    </block>
    
    <block type="controls_flow_statements">
      <field name="FLOW">BREAK</field>
    </block>

</category>`; 
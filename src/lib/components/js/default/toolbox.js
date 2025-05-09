// Auto-generated from toolbox.xml
// Do not edit directly - use the XML file instead

export const toolboxXml = `<category name="Standard Blocks" colour="210">
  <category name="Logic" colour="210">

    <block type="controls_if">
      <value name="IF0">
        <block type="logic_compare">
          <field name="OP">EQ</field>
          <value name="A">
            <block type="math_number">
              <field name="NUM">1</field>
            </block>
          </value>
          <value name="B">
            <block type="math_number">
              <field name="NUM">1</field>
            </block>
          </value>
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
  </category>

  <category name="Loops" colour="120">
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
        <block type="text_print">
          <value name="TEXT">
            <block type="variables_get">
              <field name="VAR" id="control_foreach_var">item</field>
            </block>
          </value>
        </block>
      </statement>
    </block>

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
        </block>
      </statement>
    </block>

    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
    <block type="controls_whileUntil">
      <field name="MODE">WHILE</field>
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
    </block>
    <block type="controls_forEach">
      <field name="VAR" id="control_foreach_var">item</field>
    </block>
    <block type="controls_flow_statements">
      <field name="FLOW">BREAK</field>
    </block>
  </category>

  <category name="Math" colour="230">

    <block type="variables_set">
      <field name="VAR">complexMathResult</field>
      <value name="VALUE">
        <block type="math_arithmetic">
          <field name="OP">ADD</field>
          <value name="A">
            <block type="math_arithmetic">
              <field name="OP">MULTIPLY</field>
              <value name="A">
                <block type="math_single">
                  <field name="OP">ROOT</field>
                  <value name="NUM">
                    <block type="math_number">
                      <field name="NUM">16</field>
                    </block>
                  </value>
                </block>
              </value>
              <value name="B">
                <block type="math_trig">
                  <field name="OP">SIN</field>
                  <value name="NUM">
                    <block type="math_constant">
                      <field name="CONSTANT">PI</field>
                    </block>
                  </value>
                </block>
              </value>
            </block>
          </value>
          <value name="B">
            <block type="math_round">
              <field name="OP">ROUND</field>
              <value name="NUM">
                <block type="math_on_list">
                  <mutation op="AVERAGE"></mutation>
                  <field name="OP">AVERAGE</field>
                  <value name="LIST">
                    <block type="lists_create_with">
                      <mutation items="3"></mutation>
                      <value name="ADD0">
                        <block type="math_modulo">
                          <value name="DIVIDEND">
                            <block type="math_number">
                              <field name="NUM">17</field>
                            </block>
                          </value>
                          <value name="DIVISOR">
                            <block type="math_number">
                              <field name="NUM">5</field>
                            </block>
                          </value>
                        </block>
                      </value>
                      <value name="ADD1">
                        <block type="math_constrain">
                          <value name="VALUE">
                            <block type="math_random_int">
                              <value name="FROM">
                                <block type="math_number">
                                  <field name="NUM">1</field>
                                </block>
                              </value>
                              <value name="TO">
                                <block type="math_number">
                                  <field name="NUM">100</field>
                                </block>
                              </value>
                            </block>
                          </value>
                          <value name="LOW">
                            <block type="math_number">
                              <field name="NUM">10</field>
                            </block>
                          </value>
                          <value name="HIGH">
                            <block type="math_number">
                              <field name="NUM">50</field>
                            </block>
                          </value>
                        </block>
                      </value>
                      <value name="ADD2">
                        <block type="math_number_property">
                          <mutation divisor_input="false"></mutation>
                          <field name="PROPERTY">EVEN</field>
                          <value name="NUMBER_TO_CHECK">
                            <block type="math_arithmetic">
                              <field name="OP">MULTIPLY</field>
                              <value name="A">
                                <block type="math_random_float"></block>
                              </value>
                              <value name="B">
                                <block type="math_number">
                                  <field name="NUM">10</field>
                                </block>
                              </value>
                            </block>
                          </value>
                        </block>
                      </value>
                    </block>
                  </value>
                </block>
              </value>
            </block>
          </value>
        </block>
      </value>
    </block>

    <block type="variables_set">
      <field name="VAR">squareRoot</field>
      <value name="VALUE">
        <block type="math_single">
          <field name="OP">ROOT</field>
          <value name="NUM">
            <block type="math_number">
              <field name="NUM">16</field>
            </block>
          </value>
        </block>
      </value>
    </block>

    <block type="variables_set">
      <field name="VAR">trigValue</field>
      <value name="VALUE">
        <block type="math_trig">
          <field name="OP">SIN</field>
          <value name="NUM">
            <block type="math_number">
              <field name="NUM">30</field>
            </block>
          </value>
        </block>
      </value>
    </block>

    <block type="variables_set">
      <field name="VAR">mathConstant</field>
      <value name="VALUE">
        <block type="math_constant">
          <field name="CONSTANT">PI</field>
        </block>
      </value>
    </block>

    <block type="variables_set">
      <field name="VAR">isEven</field>
      <value name="VALUE">
        <block type="math_number_property">
          <mutation divisor_input="false"></mutation>
          <field name="PROPERTY">EVEN</field>
          <value name="NUMBER_TO_CHECK">
            <block type="math_number">
              <field name="NUM">42</field>
            </block>
          </value>
        </block>
      </value>
    </block>

    <block type="variables_set">
      <field name="VAR">roundedNumber</field>
      <value name="VALUE">
        <block type="math_round">
          <field name="OP">ROUND</field>
          <value name="NUM">
            <block type="math_number">
              <field name="NUM">3.7</field>
            </block>
          </value>
        </block>
      </value>
    </block>

    <block type="variables_set">
      <field name="VAR">listSum</field>
      <value name="VALUE">
        <block type="math_on_list">
          <mutation op="SUM"></mutation>
          <field name="OP">SUM</field>
          <value name="LIST">
            <block type="lists_create_with">
              <mutation items="3"></mutation>
              <value name="ADD0">
                <block type="math_number">
                  <field name="NUM">1</field>
                </block>
              </value>
              <value name="ADD1">
                <block type="math_number">
                  <field name="NUM">2</field>
                </block>
              </value>
              <value name="ADD2">
                <block type="math_number">
                  <field name="NUM">3</field>
                </block>
              </value>
            </block>
          </value>
        </block>
      </value>
    </block>

    <block type="variables_set">
      <field name="VAR">remainder</field>
      <value name="VALUE">
        <block type="math_modulo">
          <value name="DIVIDEND">
            <block type="math_number">
              <field name="NUM">17</field>
            </block>
          </value>
          <value name="DIVISOR">
            <block type="math_number">
              <field name="NUM">5</field>
            </block>
          </value>
        </block>
      </value>
    </block>

    <block type="variables_set">
      <field name="VAR">constrainedValue</field>
      <value name="VALUE">
        <block type="math_constrain">
          <value name="VALUE">
            <block type="math_number">
              <field name="NUM">75</field>
            </block>
          </value>
          <value name="LOW">
            <block type="math_number">
              <field name="NUM">25</field>
            </block>
          </value>
          <value name="HIGH">
            <block type="math_number">
              <field name="NUM">50</field>
            </block>
          </value>
        </block>
      </value>
    </block>

    <block type="variables_set">
      <field name="VAR">randomInt</field>
      <value name="VALUE">
        <block type="math_random_int">
          <value name="FROM">
            <block type="math_number">
              <field name="NUM">1</field>
            </block>
          </value>
          <value name="TO">
            <block type="math_number">
              <field name="NUM">10</field>
            </block>
          </value>
        </block>
      </value>
    </block>

    <block type="variables_set">
      <field name="VAR">randomFloat</field>
      <value name="VALUE">
        <block type="math_random_float"></block>
      </value>
    </block>

    <block type="math_number">
      <field name="NUM">0</field>
    </block>
    <block type="math_arithmetic">
      <field name="OP">ADD</field>
      <value name="A">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="B">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
    </block>
    <block type="math_single">
      <field name="OP">ROOT</field>
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM">9</field>
        </shadow>
      </value>
    </block>
    <block type="math_trig">
      <field name="OP">SIN</field>
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM">45</field>
        </shadow>
      </value>
    </block>
    <block type="math_constant">
      <field name="CONSTANT">PI</field>
    </block>
    <block type="math_number_property">
      <mutation divisor_input="false"></mutation>
      <field name="PROPERTY">EVEN</field>
      <value name="NUMBER_TO_CHECK">
        <shadow type="math_number">
          <field name="NUM">0</field>
        </shadow>
      </value>
    </block>
    <block type="math_round">
      <field name="OP">ROUND</field>
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM">3.1</field>
        </shadow>
      </value>
    </block>
    <block type="math_on_list">
      <mutation op="SUM"></mutation>
      <field name="OP">SUM</field>
    </block>
    <block type="math_modulo">
      <value name="DIVIDEND">
        <shadow type="math_number">
          <field name="NUM">64</field>
        </shadow>
      </value>
      <value name="DIVISOR">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
    <block type="math_constrain">
      <value name="VALUE">
        <shadow type="math_number">
          <field name="NUM">50</field>
        </shadow>
      </value>
      <value name="LOW">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="HIGH">
        <shadow type="math_number">
          <field name="NUM">100</field>
        </shadow>
      </value>
    </block>
    <block type="math_random_int">
      <value name="FROM">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="TO">
        <shadow type="math_number">
          <field name="NUM">100</field>
        </shadow>
      </value>
    </block>
    <block type="math_random_float"></block>
  </category>

  <category name="Text" colour="160">
    <block type="text">
      <field name="TEXT"></field>
    </block>
    <block type="text_join">
      <mutation items="2"></mutation>
    </block>
    <block type="text_append">
      <field name="VAR" id="text_append_var">item</field>
      <value name="TEXT">
        <shadow type="text">
          <field name="TEXT"></field>
        </shadow>
      </value>
    </block>
    <block type="text_length">
      <value name="VALUE">
        <shadow type="text">
          <field name="TEXT">abc</field>
        </shadow>
      </value>
    </block>
    <block type="text_isEmpty">
      <value name="VALUE">
        <shadow type="text">
          <field name="TEXT"></field>
        </shadow>
      </value>
    </block>
    <block type="text_indexOf">
      <field name="END">FIRST</field>
      <value name="VALUE">
        <block type="variables_get">
          <field name="VAR">text</field>
        </block>
      </value>
      <value name="FIND">
        <shadow type="text">
          <field name="TEXT">abc</field>
        </shadow>
      </value>
    </block>
    <block type="text_charAt">
      <mutation at="true"></mutation>
      <field name="WHERE">FROM_START</field>
      <value name="VALUE">
        <block type="variables_get">
          <field name="VAR">text</field>
        </block>
      </value>
    </block>
    <block type="text_getSubstring">
      <mutation at1="true" at2="true"></mutation>
      <field name="WHERE1">FROM_START</field>
      <field name="WHERE2">FROM_START</field>
      <value name="STRING">
        <block type="variables_get">
          <field name="VAR">text</field>
        </block>
      </value>
    </block>
    <block type="text_changeCase">
      <field name="CASE">UPPERCASE</field>
      <value name="TEXT">
        <shadow type="text">
          <field name="TEXT">abc</field>
        </shadow>
      </value>
    </block>
    <block type="text_trim">
      <field name="MODE">BOTH</field>
      <value name="TEXT">
        <shadow type="text">
          <field name="TEXT">abc</field>
        </shadow>
      </value>
    </block>
    <block type="text_print">
      <value name="TEXT">
        <shadow type="text">
          <field name="TEXT">abc</field>
        </shadow>
      </value>
    </block>
    <block type="text_prompt_ext">
      <mutation type="TEXT"></mutation>
      <field name="TYPE">TEXT</field>
      <value name="TEXT">
        <shadow type="text">
          <field name="TEXT">abc</field>
        </shadow>
      </value>
    </block>
  </category>

  <category name="Lists" colour="260">
    <block type="lists_getIndex">
      <mutation statement="false" at="true"></mutation>
      <field name="MODE">GET</field>
      <field name="WHERE">FROM_START</field>
      <value name="VALUE">
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
      <value name="AT">
        <block type="math_number">
          <field name="NUM">1</field>
        </block>
      </value>
    </block>

    <block type="lists_create_empty"></block>
    <block type="lists_create_with">
      <mutation items="3"></mutation>
    </block>
    <block type="lists_repeat">
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM">5</field>
        </shadow>
      </value>
    </block>
    <block type="lists_length"></block>
    <block type="lists_isEmpty"></block>
    <block type="lists_indexOf">
      <field name="END">FIRST</field>
      <value name="VALUE">
        <block type="variables_get">
          <field name="VAR">list</field>
        </block>
      </value>
    </block>
    <block type="lists_getIndex">
      <mutation statement="false" at="true"></mutation>
      <field name="MODE">GET</field>
      <field name="WHERE">FROM_START</field>
      <value name="VALUE">
        <block type="variables_get">
          <field name="VAR">list</field>
        </block>
      </value>
    </block>
    <block type="lists_setIndex">
      <mutation at="true"></mutation>
      <field name="MODE">SET</field>
      <field name="WHERE">FROM_START</field>
      <value name="LIST">
        <block type="variables_get">
          <field name="VAR">list</field>
        </block>
      </value>
    </block>
    <block type="lists_getSublist">
      <mutation at1="true" at2="true"></mutation>
      <field name="WHERE1">FROM_START</field>
      <field name="WHERE2">FROM_START</field>
      <value name="LIST">
        <block type="variables_get">
          <field name="VAR">list</field>
        </block>
      </value>
    </block>
    <block type="lists_split">
      <mutation mode="SPLIT"></mutation>
      <field name="MODE">SPLIT</field>
      <value name="DELIM">
        <shadow type="text">
          <field name="TEXT">,</field>
        </shadow>
      </value>
    </block>
    <block type="lists_sort">
      <field name="TYPE">NUMERIC</field>
      <field name="DIRECTION">1</field>
    </block>
  </category>

</category>
`;

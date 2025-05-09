export const toolboxXml = `<category name="Math" colour="180">

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
  </category>`



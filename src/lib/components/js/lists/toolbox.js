export const toolboxXml = `<category name="Lists" colour="160">

<block type="variables_set">
  <field name="VAR">emptyList</field>
  <value name="VALUE">
    <block type="lists_create_empty"></block>
  </value>
  <next>
    <block type="variables_set">
      <field name="VAR">simpleList</field>
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
              <field name="TEXT">cherry</field>
            </block>
          </value>
        </block>
      </value>
      <next>
        <block type="variables_set">
          <field name="VAR">repeatedList</field>
          <value name="VALUE">
            <block type="lists_repeat">
              <value name="ITEM">
                <block type="text">
                  <field name="TEXT">item</field>
                </block>
              </value>
              <value name="NUM">
                <block type="math_number">
                  <field name="NUM">5</field>
                </block>
              </value>
            </block>
          </value>
          <next>
            <block type="variables_set">
              <field name="VAR">listLength</field>
              <value name="VALUE">
                <block type="lists_length">
                  <value name="VALUE">
                    <block type="variables_get">
                      <field name="VAR">simpleList</field>
                    </block>
                  </value>
                </block>
              </value>
              <next>
                <block type="variables_set">
                  <field name="VAR">isListEmpty</field>
                  <value name="VALUE">
                    <block type="lists_isEmpty">
                      <value name="VALUE">
                        <block type="variables_get">
                          <field name="VAR">emptyList</field>
                        </block>
                      </value>
                    </block>
                  </value>
                  <next>
                    <block type="variables_set">
                      <field name="VAR">itemPosition</field>
                      <value name="VALUE">
                        <block type="lists_indexOf">
                          <field name="END">FIRST</field>
                          <value name="VALUE">
                            <block type="variables_get">
                              <field name="VAR">simpleList</field>
                            </block>
                          </value>
                          <value name="FIND">
                            <block type="text">
                              <field name="TEXT">banana</field>
                            </block>
                          </value>
                        </block>
                      </value>
                      <next>
                        <block type="variables_set">
                          <field name="VAR">itemFromList</field>
                          <value name="VALUE">
                            <block type="lists_getIndex">
                              <mutation statement="false" at="true"></mutation>
                              <field name="MODE">GET</field>
                              <field name="WHERE">FROM_START</field>
                              <value name="VALUE">
                                <block type="variables_get">
                                  <field name="VAR">simpleList</field>
                                </block>
                              </value>
                              <value name="AT">
                                <block type="math_number">
                                  <field name="NUM">1</field>
                                </block>
                              </value>
                            </block>
                          </value>
                          <next>
                            <block type="lists_setIndex">
                              <mutation at="true"></mutation>
                              <field name="MODE">SET</field>
                              <field name="WHERE">FROM_START</field>
                              <value name="LIST">
                                <block type="variables_get">
                                  <field name="VAR">simpleList</field>
                                </block>
                              </value>
                              <value name="AT">
                                <block type="math_number">
                                  <field name="NUM">2</field>
                                </block>
                              </value>
                              <value name="TO">
                                <block type="text">
                                  <field name="TEXT">orange</field>
                                </block>
                              </value>
                              <next>
                                <block type="variables_set">
                                  <field name="VAR">subList</field>
                                  <value name="VALUE">
                                    <block type="lists_getSublist">
                                      <mutation at1="true" at2="true"></mutation>
                                      <field name="WHERE1">FROM_START</field>
                                      <field name="WHERE2">FROM_START</field>
                                      <value name="LIST">
                                        <block type="variables_get">
                                          <field name="VAR">simpleList</field>
                                        </block>
                                      </value>
                                      <value name="AT1">
                                        <block type="math_number">
                                          <field name="NUM">1</field>
                                        </block>
                                      </value>
                                      <value name="AT2">
                                        <block type="math_number">
                                          <field name="NUM">2</field>
                                        </block>
                                      </value>
                                    </block>
                                  </value>
                                  <next>
                                    <block type="variables_set">
                                      <field name="VAR">sortedList</field>
                                      <value name="VALUE">
                                        <block type="lists_sort">
                                          <field name="TYPE">NUMERIC</field>
                                          <field name="DIRECTION">1</field>
                                          <value name="LIST">
                                            <block type="lists_create_with">
                                              <mutation items="3"></mutation>
                                              <value name="ADD0">
                                                <block type="math_number">
                                                  <field name="NUM">3</field>
                                                </block>
                                              </value>
                                              <value name="ADD1">
                                                <block type="math_number">
                                                  <field name="NUM">1</field>
                                                </block>
                                              </value>
                                              <value name="ADD2">
                                                <block type="math_number">
                                                  <field name="NUM">2</field>
                                                </block>
                                              </value>
                                            </block>
                                          </value>
                                        </block>
                                      </value>
                                      <next>
                                        <block type="variables_set">
                                          <field name="VAR">joinedList</field>
                                          <value name="VALUE">
                                            <block type="lists_split">
                                              <mutation mode="JOIN"></mutation>
                                              <field name="MODE">JOIN</field>
                                              <value name="INPUT">
                                                <block type="variables_get">
                                                  <field name="VAR">simpleList</field>
                                                </block>
                                              </value>
                                              <value name="DELIM">
                                                <block type="text">
                                                  <field name="TEXT">, </field>
                                                </block>
                                              </value>
                                            </block>
                                          </value>
                                          <next>
                                            <block type="console_log">
                                              <value name="TEXT">
                                                <block type="text">
                                                  <field name="TEXT">List operations complete!</field>
                                                </block>
                                              </value>
                                            </block>
                                          </next>
                                        </block>
                                      </next>
                                    </block>
                                  </next>
                                </block>
                              </next>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </next>
    </block>
  </next>
</block>

<block type="variables_set">
  <field name="VAR">emptyList</field>
  <value name="VALUE">
    <block type="lists_create_empty"></block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">simpleList</field>
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
          <field name="TEXT">cherry</field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">repeatedList</field>
  <value name="VALUE">
    <block type="lists_repeat">
      <value name="ITEM">
        <block type="text">
          <field name="TEXT">item</field>
        </block>
      </value>
      <value name="NUM">
        <block type="math_number">
          <field name="NUM">5</field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">listLength</field>
  <value name="VALUE">
    <block type="lists_length">
      <value name="VALUE">
        <block type="variables_get">
          <field name="VAR">myList</field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">isListEmpty</field>
  <value name="VALUE">
    <block type="lists_isEmpty">
      <value name="VALUE">
        <block type="variables_get">
          <field name="VAR">myList</field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">itemPosition</field>
  <value name="VALUE">
    <block type="lists_indexOf">
      <field name="END">FIRST</field>
      <value name="VALUE">
        <block type="variables_get">
          <field name="VAR">myList</field>
        </block>
      </value>
      <value name="FIND">
        <block type="text">
          <field name="TEXT">item</field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">itemFromList</field>
  <value name="VALUE">
    <block type="lists_getIndex">
      <mutation statement="false" at="true"></mutation>
      <field name="MODE">GET</field>
      <field name="WHERE">FROM_START</field>
      <value name="VALUE">
        <block type="variables_get">
          <field name="VAR">myList</field>
        </block>
      </value>
      <value name="AT">
        <block type="math_number">
          <field name="NUM">1</field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="lists_setIndex">
  <mutation at="true"></mutation>
  <field name="MODE">SET</field>
  <field name="WHERE">FROM_START</field>
  <value name="LIST">
    <block type="variables_get">
      <field name="VAR">myList</field>
    </block>
  </value>
  <value name="AT">
    <block type="math_number">
      <field name="NUM">1</field>
    </block>
  </value>
  <value name="TO">
    <block type="text">
      <field name="TEXT">new item</field>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">subList</field>
  <value name="VALUE">
    <block type="lists_getSublist">
      <mutation at1="true" at2="true"></mutation>
      <field name="WHERE1">FROM_START</field>
      <field name="WHERE2">FROM_START</field>
      <value name="LIST">
        <block type="variables_get">
          <field name="VAR">myList</field>
        </block>
      </value>
      <value name="AT1">
        <block type="math_number">
          <field name="NUM">1</field>
        </block>
      </value>
      <value name="AT2">
        <block type="math_number">
          <field name="NUM">3</field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">myList</field>
  <value name="VALUE">
    <block type="lists_create_with">
      <mutation items="3"></mutation>
      <value name="ADD0">
        <block type="math_number">
          <field name="NUM">3</field>
        </block>
      </value>
      <value name="ADD1">
        <block type="math_number">
          <field name="NUM">1</field>
        </block>
      </value>
      <value name="ADD2">
        <block type="math_number">
          <field name="NUM">2</field>
        </block>
      </value>
    </block>
  </value>
  <next>
    <block type="variables_set">
    <field name="VAR">sortedList</field>
    <value name="VALUE">
        <block type="lists_sort">
        <field name="TYPE">NUMERIC</field>
        <field name="DIRECTION">1</field>
        <value name="LIST">
            <block type="variables_get">
            <field name="VAR">myList</field>
            </block>
        </value>
        </block>
    </value>
    </block>
  </next>
</block>

<block type="variables_set">
  <field name="VAR">joinedList</field>
  <value name="VALUE">
    <block type="lists_split">
      <mutation mode="JOIN"></mutation>
      <field name="MODE">JOIN</field>
      <value name="INPUT">
        <block type="variables_get">
          <field name="VAR">myList</field>
        </block>
      </value>
      <value name="DELIM">
        <block type="text">
          <field name="TEXT">, </field>
        </block>
      </value>
    </block>
  </value>
</block>

</category>` 
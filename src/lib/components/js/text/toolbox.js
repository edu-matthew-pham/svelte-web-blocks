export const toolboxXml = `<category name="Text" colour="160">

<block type="variables_set">
  <field name="VAR">simpleText</field>
  <value name="VALUE">
    <block type="text">
      <field name="TEXT">Hello World</field>
    </block>
  </value>
  <next>
    <block type="variables_set">
      <field name="VAR">joinedText</field>
      <value name="VALUE">
        <block type="text_join">
          <mutation items="2"></mutation>
          <value name="ADD0">
            <block type="text">
              <field name="TEXT">Hello </field>
            </block>
          </value>
          <value name="ADD1">
            <block type="text">
              <field name="TEXT">World</field>
            </block>
          </value>
        </block>
      </value>
      <next>
        <block type="variables_set">
          <field name="VAR">textLength</field>
          <value name="VALUE">
            <block type="text_length">
              <value name="VALUE">
                <block type="text">
                  <field name="TEXT">Hello World</field>
                </block>
              </value>
            </block>
          </value>
          <next>
            <block type="variables_set">
              <field name="VAR">isTextEmpty</field>
              <value name="VALUE">
                <block type="text_isEmpty">
                  <value name="VALUE">
                    <block type="text">
                      <field name="TEXT"></field>
                    </block>
                  </value>
                </block>
              </value>
              <next>
                <block type="variables_set">
                  <field name="VAR">textPosition</field>
                  <value name="VALUE">
                    <block type="text_indexOf">
                      <field name="END">FIRST</field>
                      <value name="VALUE">
                        <block type="text">
                          <field name="TEXT">Hello World</field>
                        </block>
                      </value>
                      <value name="FIND">
                        <block type="text">
                          <field name="TEXT">World</field>
                        </block>
                      </value>
                    </block>
                  </value>
                  <next>
                    <block type="console_log">
                      <value name="TEXT">
                        <block type="text">
                          <field name="TEXT">Text operations complete!</field>
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

<block type="variables_set">
  <field name="VAR">complexTextResult</field>
  <value name="VALUE">
    <block type="text_join">
      <mutation items="3"></mutation>
      <value name="ADD0">
        <block type="text_changeCase">
          <field name="CASE">UPPERCASE</field>
          <value name="TEXT">
            <block type="text">
              <field name="TEXT">hello</field>
            </block>
          </value>
        </block>
      </value>
      <value name="ADD1">
        <block type="text">
          <field name="TEXT">, </field>
        </block>
      </value>
      <value name="ADD2">
        <block type="text_trim">
          <field name="MODE">BOTH</field>
          <value name="TEXT">
            <block type="text">
              <field name="TEXT">  world!  </field>
            </block>
          </value>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">simpleText</field>
  <value name="VALUE">
    <block type="text">
      <field name="TEXT">Hello World</field>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">joinedText</field>
  <value name="VALUE">
    <block type="text_join">
      <mutation items="2"></mutation>
      <value name="ADD0">
        <block type="text">
          <field name="TEXT">Hello </field>
        </block>
      </value>
      <value name="ADD1">
        <block type="text">
          <field name="TEXT">World</field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">textLength</field>
  <value name="VALUE">
    <block type="text_length">
      <value name="VALUE">
        <block type="text">
          <field name="TEXT">Hello World</field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">isTextEmpty</field>
  <value name="VALUE">
    <block type="text_isEmpty">
      <value name="VALUE">
        <block type="text">
          <field name="TEXT"></field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">textPosition</field>
  <value name="VALUE">
    <block type="text_indexOf">
      <field name="END">FIRST</field>
      <value name="VALUE">
        <block type="text">
          <field name="TEXT">Hello World</field>
        </block>
      </value>
      <value name="FIND">
        <block type="text">
          <field name="TEXT">World</field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">character</field>
  <value name="VALUE">
    <block type="text_charAt">
      <mutation at="true"></mutation>
      <field name="WHERE">FROM_START</field>
      <value name="VALUE">
        <block type="text">
          <field name="TEXT">Hello World</field>
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

<block type="variables_set">
  <field name="VAR">substring</field>
  <value name="VALUE">
    <block type="text_getSubstring">
      <mutation at1="true" at2="true"></mutation>
      <field name="WHERE1">FROM_START</field>
      <field name="WHERE2">FROM_START</field>
      <value name="STRING">
        <block type="text">
          <field name="TEXT">Hello World</field>
        </block>
      </value>
      <value name="AT1">
        <block type="math_number">
          <field name="NUM">1</field>
        </block>
      </value>
      <value name="AT2">
        <block type="math_number">
          <field name="NUM">5</field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">upperCase</field>
  <value name="VALUE">
    <block type="text_changeCase">
      <field name="CASE">UPPERCASE</field>
      <value name="TEXT">
        <block type="text">
          <field name="TEXT">Hello World</field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">trimmedText</field>
  <value name="VALUE">
    <block type="text_trim">
      <field name="MODE">BOTH</field>
      <value name="TEXT">
        <block type="text">
          <field name="TEXT">  Hello World  </field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">splitText</field>
  <value name="VALUE">
    <block type="lists_split">
      <mutation mode="SPLIT"></mutation>
      <field name="MODE">SPLIT</field>
      <value name="INPUT">
        <block type="text">
          <field name="TEXT">Hello,World,Example</field>
        </block>
      </value>
      <value name="DELIM">
        <block type="text">
          <field name="TEXT">,</field>
        </block>
      </value>
    </block>
  </value>
</block>

<block type="text_print">
  <value name="TEXT">
    <block type="text">
      <field name="TEXT">Hello World</field>
    </block>
  </value>
</block>

<block type="variables_set">
  <field name="VAR">promptResult</field>
  <value name="VALUE">
    <block type="text_prompt_ext">
      <mutation type="TEXT"></mutation>
      <field name="TYPE">TEXT</field>
      <value name="TEXT">
        <block type="text">
          <field name="TEXT">Please enter your name</field>
        </block>
      </value>
    </block>
  </value>
</block>

</category>` 
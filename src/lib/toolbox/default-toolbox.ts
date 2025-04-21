export const defaultToolbox: string = `
<xml>
  <category name="Document" colour="290">
    <block type="web_document">
      <field name="TITLE">My Web Page</field>
      <field name="THEME">light</field>
    </block>
  </category>
  
  <category name="Navigation" colour="230">
    <block type="web_header">
      <field name="LOGO_TEXT">My Website</field>
      <field name="INCLUDE_SIGNUP">TRUE</field>
    </block>
    <block type="web_nav_item">
      <field name="TEXT">Home</field>
      <field name="URL">home.html</field>
    </block>
  </category>
  
  <category name="Hero Sections" colour="160">
    <block type="web_hero">
      <field name="HEADLINE">Welcome to Our Website</field>
      <field name="SUBHEADLINE">Build beautiful web experiences without coding</field>
      <field name="BUTTON_TEXT">Get Started</field>
      <field name="BUTTON_URL">/signup</field>
      <field name="HAS_IMAGE">TRUE</field>
      <field name="IMAGE_URL">https://picsum.photos/600/400</field>
    </block>
  </category>
  
  <category name="Features" colour="330">
    <block type="web_feature_cards">
      <field name="TITLE">Our Features</field>
      <field name="COLUMNS">3</field>

    </block>
    <block type="web_feature_card">
      <field name="ICON">🚀</field>
      <field name="TITLE">Fast and Reliable</field>
      <field name="DESCRIPTION">Our platform is optimized for speed and uptime.</field>
    </block>
  </category>

  <category name="Content" colour="120">
    <block type="web_content_section">
      <field name="HEADLINE">Section Title</field>
      <field name="COLUMNS">1</field>
    </block>
    <block type="web_content_block">
      <field name="CONTENT">### Heading\n\nAdd your **formatted** content *here*.\n\n- Bullet point\n- Another point\n\n[Link text](https://example.com)\n\n![Example image](https://picsum.photos/400/200)</field>
    </block>
  </category>
  
  <category name="Forms" colour="60">
    <block type="web_basic_form">
      <field name="TITLE">Contact Us</field>
      <field name="SUBMIT_TEXT">Send</field>
    </block>
    <block type="web_form_field">
      <field name="LABEL">Name</field>
      <field name="TYPE">text</field>
      <field name="REQUIRED">TRUE</field>
    </block>
    <block type="web_form_field">
      <field name="LABEL">Email</field>
      <field name="TYPE">email</field>
      <field name="REQUIRED">TRUE</field>
    </block>
    <block type="web_form_field">
      <field name="LABEL">Message</field>
      <field name="TYPE">textarea</field>
      <field name="REQUIRED">TRUE</field>
    </block>
    <block type="web_form_field">
      <field name="LABEL">Choose Option</field>
      <field name="TYPE">select</field>
      <field name="REQUIRED">FALSE</field>
      <field name="OPTIONS">Option 1, Option 2, Option 3</field>
    </block>
    <block type="web_form_field">
      <field name="LABEL">Agree to Terms</field>
      <field name="TYPE">checkbox</field>
      <field name="REQUIRED">TRUE</field>
    </block>
    <block type="web_form_field">
      <field name="LABEL">Preferred Contact Method</field>
      <field name="TYPE">radio</field>
      <field name="REQUIRED">TRUE</field>
      <field name="OPTIONS">Email, Phone, Mail</field>
    </block>
    <block type="web_form_field">
      <field name="LABEL">Appointment Date</field>
      <field name="TYPE">date</field>
      <field name="REQUIRED">FALSE</field>
    </block>
  </category>
  
  <category name="Footer" colour="330">
    <block type="web_footer">
      <field name="COPYRIGHT">© 2023 My Company</field>
    </block>
    <block type="web_footer_link">
      <field name="TEXT">Privacy Policy</field>
      <field name="URL">/privacy</field>
    </block>
  </category>

  <category name="Dynamic Content" colour="210">
    <block type="web_dynamic_cards">
      <field name="TITLE">Feature Cards</field>
      <field name="LAYOUT">grid</field>
      <field name="COLUMNS">3</field>
      <field name="DATA">[
        {"title": "Fast Performance", "icon": "🚀", "description": "Our platform is optimized for speed and reliability."},
        {"title": "Easy to Use", "icon": "⚡", "description": "Simple interface that anyone can master quickly."},
        {"title": "Powerful Analytics", "icon": "📊", "description": "Gain insights with comprehensive data analysis."}
      ]</field>
    </block>
    <block type="web_image_gallery">
      <field name="TITLE">Photo Gallery</field>
      <field name="THUMBNAIL_SIZE">medium</field>
      <field name="LIGHTBOX">TRUE</field>
      <field name="DATA">[
        {"url": "https://picsum.photos/id/1/800/600", "caption": "Mountain View", "thumbnail": "https://picsum.photos/id/1/200/150"},
        {"url": "https://picsum.photos/id/10/800/600", "caption": "Ocean Waves", "thumbnail": "https://picsum.photos/id/10/200/150"},
        {"url": "https://picsum.photos/id/100/800/600", "caption": "Beach Sunset", "thumbnail": "https://picsum.photos/id/100/200/150"}
      ]</field>
    </block>
    <block type="web_accordion">
      <field name="TITLE">Frequently Asked Questions</field>
      <field name="ALLOW_MULTIPLE">TRUE</field>
      <field name="DATA">[
        {"title": "How do I get started?", "content": "Sign up for an account and follow our simple onboarding process."},
        {"title": "Is there a free trial?", "content": "Yes, we offer a 14-day free trial with all features included."},
        {"title": "How does billing work?", "content": "We offer monthly and annual subscription plans with various tiers."}
      ]</field>
    </block>
  </category>
  
  
  <category name="JavaScript" colour="270">
  
    <category name="Variables & Functions" colour="290">
    <label text="Variables" web-class="toolboxLabel"></label>
      <block type="variables_set">
        <field name="VAR">myVariable</field>
      </block>
      <block type="variables_get">
        <field name="VAR">myVariable</field>
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
        <mutation name="myFunction"></mutation>
      </block>
      <block type="procedures_callreturn">
        <mutation name="myFunctionWithReturn"></mutation>
      </block>
    </category>

    

     <category name="Logic & Loops" colour="210">
      <label text="Logic" web-class="toolboxLabel"></label>
      <block type="js_conditional">
        <field name="CONDITION">x > 10</field>
      </block>
      
      <block type="js_conditional_else">
        <field name="CONDITION">x > 10</field>
      </block>
      
      <block type="js_comparison">
        <field name="LEFT">a</field>
        <field name="OPERATOR">===</field>
        <field name="RIGHT">b</field>
      </block>
      
      <block type="js_logical">
        <field name="OPERATOR">&&</field>
        <field name="LEFT">a > 5</field>
        <field name="RIGHT">b < 10</field>
      </block>
      
      <sep gap="8"></sep>
      <label text="Loops" web-class="toolboxLabel"></label>
      
      <block type="js_for_loop">
        <field name="INIT">let i = 0</field>
        <field name="CONDITION">i < 10</field>
        <field name="UPDATE">i++</field>
      </block>
      
      <block type="js_for_of">
        <field name="VARIABLE">item</field>
        <field name="ARRAY">items</field>
      </block>
      
      <block type="js_while_loop">
        <field name="CONDITION">count < 5</field>
      </block>
      
      <block type="js_repeat">
        <field name="TIMES">3</field>
      </block>
    </category>

    <category name="List Helpers" colour="160">
      <block type="list_create">
        <field name="DATA">item1, item2, item3</field>
      </block>
      <block type="list_operation">
        <field name="OPERATION">add</field>
        <value name="LIST">
          <shadow type="list_create">
            <field name="DATA">item1, item2, item3</field>
          </shadow>
        </value>
        <value name="INDEX">
          <shadow type="math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
        <value name="ITEM">
          <shadow type="text">
            <field name="TEXT">New item</field>
          </shadow>
        </value>
      </block>
      <block type="list_query">
        <field name="QUERY">length</field>
        <value name="LIST">
          <shadow type="list_create">
            <field name="DATA">item1, item2, item3</field>
          </shadow>
        </value>
        <value name="ITEM">
          <shadow type="text">
            <field name="TEXT">item</field>
          </shadow>
        </value>
      </block>
      <block type="list_join">
        <field name="SEPARATOR">, </field>
        <value name="LIST">
          <shadow type="list_create">
            <field name="DATA">item1, item2, item3</field>
          </shadow>
        </value>
      </block>
      <block type="list_sort">
        <field name="ORDER">ascending</field>
        <value name="LIST">
          <shadow type="list_create">
            <field name="DATA">item1, item2, item3</field>
          </shadow>
        </value>
      </block>
    </category>

    

    <category name="Data Objects" colour="170">
      <block type="create_object">
        <field name="OBJECT">{
  "key1": "value1",
  "key2": 42,
  "key3": true
}</field>
      </block>
      <block type="get_object_property">
        <field name="PROPERTY">key</field>
      </block>
      <block type="set_object_property">
        <field name="PROPERTY">key</field>
      </block>
      <block type="parse_json">
        <value name="JSON_STRING">
          <shadow type="text">
            <field name="TEXT">{"data": "value"}</field>
          </shadow>
        </value>
      </block>
      <block type="stringify_object">
        <value name="OBJECT">
          <shadow type="create_object">
            <field name="OBJECT">{"example": "data"}</field>
          </shadow>
        </value>
      </block>
    </category>

    <category name="Expressions" colour="230">
      <block type="js_simple_expression">
        <field name="EXPRESSION">42</field>
      </block>
      
      <block type="js_format_currency">
        <value name="AMOUNT">
          <shadow type="math_number">
            <field name="NUM">19.99</field>
          </shadow>
        </value>
        <field name="CURRENCY">USD</field>
      </block>
      
      <block type="js_format_date">
        <value name="DATE">
          <shadow type="js_simple_expression">
            <field name="EXPRESSION">new Date()</field>
          </shadow>
        </value>
        <field name="FORMAT">short</field>
      </block>
      
      <block type="js_calculate_percentage">
        <value name="VALUE">
          <shadow type="math_number">
            <field name="NUM">25</field>
          </shadow>
        </value>
        <value name="TOTAL">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      
      <block type="js_string_template">
        <field name="TEMPLATE">Hello, {name}! Your score is {score}.</field>
        <value name="VARIABLES">
          <shadow type="js_simple_expression">
            <field name="EXPRESSION">{ name: "User", score: 42 }</field>
          </shadow>
        </value>
      </block>
      
      <block type="js_validate_input">
        <field name="TYPE">email</field>
        <value name="VALUE">
          <shadow type="js_simple_expression">
            <field name="EXPRESSION">document.getElementById('email').value</field>
          </shadow>
        </value>
      </block>
      
      <block type="js_data_operation">
        <field name="OPERATION">filter</field>
        <value name="ARRAY">
          <shadow type="js_simple_expression">
            <field name="EXPRESSION">items</field>
          </shadow>
        </value>
        <field name="CONDITION">item.price > 20</field>
      </block>
      
      <block type="js_custom_expression">
        <field name="CODE">// Your custom expression here</field>
      </block>
    </category>

    
    <category name="Interactivity" colour="180">
      <block type="js_event_listener">
        <field name="ELEMENT_SELECTOR">#my-button</field>
        <field name="EVENT_TYPE">click</field>
      </block>
      
      <sep gap="8"></sep>
      <label text="DOM Actions" web-class="toolboxLabel"></label>
      
      <block type="js_dom_modify">
        <field name="ACTION">text</field>
        <field name="SELECTOR">#element-id</field>
        <field name="PROPERTY"></field>
        <field name="VALUE">New content</field>
      </block>
      
      <block type="js_dom_modify">
        <field name="ACTION">toggleClass</field>
        <field name="SELECTOR">#element-id</field>
        <field name="PROPERTY"></field>
        <field name="VALUE">active</field>
      </block>
      
      <block type="js_dom_modify">
        <field name="ACTION">attribute</field>
        <field name="SELECTOR">#image</field>
        <field name="PROPERTY">src</field>
        <field name="VALUE">new-image.jpg</field>
      </block>
      
      <block type="js_log">
        <field name="MESSAGE">Action completed!</field>
      </block>
      
      <sep gap="8"></sep>
      
      <block type="js_custom_expression">
        <field name="CODE">// Your custom JavaScript here</field>
      </block>
    </category>

    <category name="Reactive Data" colour="290">
      <block type="reactive_store_create">
        <field name="STORE_NAME">appState</field>
        <field name="INITIAL_DATA">{
  "count": 0,
  "username": "",
  "items": [],
  "isLoggedIn": false
}</field>
      </block>
      
      <block type="reactive_get_value">
        <field name="STORE_NAME">appState</field>
        <field name="KEY">count</field>
      </block>
      
      <block type="reactive_set_value">
        <field name="STORE_NAME">appState</field>
        <field name="KEY">count</field>
        <value name="VALUE">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      
      <block type="reactive_set_expression">
        <field name="STORE_NAME">appState</field>
        <field name="KEY">count</field>
        <field name="EXPRESSION">appState.count + 1</field>
      </block>
      
      <block type="reactive_bind_element">
        <field name="ELEMENT_SELECTOR">#counter</field>
        <field name="STORE_NAME">appState</field>
        <field name="KEY">count</field>
        <field name="ATTRIBUTE">textContent</field>
      </block>
      
      <block type="reactive_bind_template">
        <field name="CONTAINER_SELECTOR">#items-container</field>
        <field name="STORE_NAME">appState</field>
        <field name="ARRAY_KEY">items</field>
        <field name="SCHEMA">{
  "id": "string",
  "title": "string",
  "description": "string"
}</field>
      </block>

      <block type="reactive_listen">
        <field name="STORE_NAME">appState</field>
        <field name="KEY">count</field>
      </block>
      
      <block type="reactive_get_new_value"></block>
      <block type="reactive_get_old_value"></block>
    </category>
   </category>
</xml>
`; 
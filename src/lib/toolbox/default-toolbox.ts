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
  
  <category name="Features" colour="290">
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
</xml>
`; 
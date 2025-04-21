// Dynamic components toolbox definition
export const dynamicToolbox = `
  <category name="Dynamic Content" colour="210">
    <block type="web_dynamic_cards">
      <field name="TITLE">Features</field>
      <field name="LAYOUT">grid</field>
      <field name="COLUMNS">3</field>
      <field name="DATA">[
  {"title": "Fast Performance", "icon": "🚀", "description": "Our platform is optimized for speed and reliability."},
  {"title": "Easy to Use", "icon": "⚡", "description": "Simple interface that anyone can master quickly."},
  {"title": "Powerful Analytics", "icon": "📊", "description": "Gain insights with comprehensive data analysis."}
]</field>
    </block>
    <block type="web_image_gallery">
      <field name="TITLE">Gallery</field>
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
      <field name="ALLOW_MULTIPLE">FALSE</field>
      <field name="DATA">[
  {"title": "How do I get started?", "content": "Sign up for an account and follow our simple onboarding process."},
  {"title": "Is there a free trial?", "content": "Yes, we offer a 14-day free trial with all features included."},
  {"title": "How does billing work?", "content": "We offer monthly and annual subscription plans with various tiers."}
]</field>
    </block>
  </category>
`; 
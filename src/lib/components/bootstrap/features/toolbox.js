// Bootstrap Features Toolbox - Minimal Version
export const toolboxXml = `<category name="Bootstrap Features" colour="120">

  <!-- Essential feature section styling -->
  <block type="custom_style_css">
    <field name="CODE">/* Essential feature section */
.feature-section {
  padding: 2rem 0;
}

.container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 15px;
}</field>
  </block>

  <!-- Simplified grid layout -->
  <block type="custom_style_css">
    <field name="CODE">/* Simplified grid layout */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
}

.column {
  flex: 1;
  padding: 0 10px;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .column {
    flex: 0 0 100%;
  }
}</field>
  </block>

  <!-- Basic card styling -->
  <block type="custom_style_css">
    <field name="CODE">/* Basic card styling */
.feature-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 0.25rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.text-center {
  text-align: center;
}</field>
  </block>

  <!-- Utility classes (Bootstrap-like) -->
  <block type="custom_style_css">
    <field name="CODE">/* Utility classes (Bootstrap-like) */
.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.me-3 {
  margin-right: 1rem;
}

.mb-0 {
  margin-bottom: 0;
}</field>
  </block>

  <!-- Single Feature Card HTML -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE">&lt;!-- Single Feature Card --&gt;
&lt;div class="column"&gt;
  &lt;div class="feature-card text-center"&gt;
    &lt;div class="card-icon"&gt;🚀&lt;/div&gt;
    &lt;h3&gt;Fast Performance&lt;/h3&gt;
    &lt;p&gt;Our platform is optimized for speed and reliability.&lt;/p&gt;
  &lt;/div&gt;
&lt;/div&gt;</field>
  </block>

  <!-- Complete Feature Section HTML -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE">&lt;!-- Feature Cards Section --&gt;
&lt;section class="feature-section"&gt;
  &lt;div class="container"&gt;
    &lt;h2 class="text-center" style="margin-bottom: 2rem;"&gt;Our Features&lt;/h2&gt;
    &lt;div class="row"&gt;
      &lt;div class="column"&gt;
        &lt;div class="feature-card text-center"&gt;
          &lt;div class="card-icon"&gt;🚀&lt;/div&gt;
          &lt;h3&gt;Fast Performance&lt;/h3&gt;
          &lt;p&gt;Our platform is optimized for speed and reliability.&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      &lt;div class="column"&gt;
        &lt;div class="feature-card text-center"&gt;
          &lt;div class="card-icon"&gt;⚡&lt;/div&gt;
          &lt;h3&gt;Easy to Use&lt;/h3&gt;
          &lt;p&gt;Simple interface that anyone can master quickly.&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      &lt;div class="column"&gt;
        &lt;div class="feature-card text-center"&gt;
          &lt;div class="card-icon"&gt;📊&lt;/div&gt;
          &lt;h3&gt;Powerful Analytics&lt;/h3&gt;
          &lt;p&gt;Gain insights with comprehensive data analysis.&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/section&gt;</field>
  </block>

  <!-- Alternative Feature Cards Layout -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE">&lt;!-- Horizontal Feature Cards --&gt;
&lt;section class="feature-section"&gt;
  &lt;div class="container"&gt;
    &lt;h2 class="text-center" style="margin-bottom: 2rem;"&gt;Key Features&lt;/h2&gt;
    &lt;div class="row"&gt;
      &lt;div class="column"&gt;
        &lt;div class="feature-card"&gt;
          &lt;div class="d-flex align-items-center" style="margin-bottom: 1rem;"&gt;
            &lt;div class="card-icon me-3 mb-0"&gt;💡&lt;/div&gt;
            &lt;h3 style="margin: 0;"&gt;Innovative Design&lt;/h3&gt;
          &lt;/div&gt;
          &lt;p&gt;Modern and intuitive interface for the best user experience.&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      &lt;div class="column"&gt;
        &lt;div class="feature-card"&gt;
          &lt;div class="d-flex align-items-center" style="margin-bottom: 1rem;"&gt;
            &lt;div class="card-icon me-3 mb-0"&gt;🔒&lt;/div&gt;
            &lt;h3 style="margin: 0;"&gt;Secure Platform&lt;/h3&gt;
          &lt;/div&gt;
          &lt;p&gt;Advanced security features to protect your data.&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      &lt;div class="column"&gt;
        &lt;div class="feature-card"&gt;
          &lt;div class="d-flex align-items-center" style="margin-bottom: 1rem;"&gt;
            &lt;div class="card-icon me-3 mb-0"&gt;🌐&lt;/div&gt;
            &lt;h3 style="margin: 0;"&gt;Global Support&lt;/h3&gt;
          &lt;/div&gt;
          &lt;p&gt;24/7 assistance available worldwide.&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/section&gt;</field>
  </block>

</category>`;

// Bootstrap Content Toolbox
export const toolboxXml = `<category name="Bootstrap Content" colour="220">

  <!-- Card container -->
  <block type="custom_style_css">
    <field name="CODE">/* Card container */
.card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: 0.25rem;
}

.card-body {
  flex: 1 1 auto;
  padding: 1rem;
}</field>
  </block>

  <!-- Card utilities -->
  <block type="custom_style_css">
    <field name="CODE">/* Card utilities */
.border-0 {
  border: 0 !important;
}

.h-100 {
  height: 100% !important;
}</field>
  </block>

  <!-- Container -->
  <block type="custom_style_css">
    <field name="CODE">/* Container */
.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  max-width: 1140px;
}</field>
  </block>

  <!-- Layout: Row and Columns -->
  <block type="custom_style_css">
    <field name="CODE">/* Row and columns */
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -0.75rem;
  margin-left: -0.75rem;
}

.col-md-6 {
  box-sizing: border-box;
  width: 50%;
  padding: 0 0.75rem;
}

@media (max-width: 768px) {
  .col-md-6 {
    width: 100%;
  }
}</field>
  </block>

  <!-- Content spacing -->
  <block type="custom_style_css">
    <field name="CODE">/* Content spacing */
.py-5 {
  padding-top: 3rem !important;
  padding-bottom: 3rem !important;
}

.mb-4 {
  margin-bottom: 1.5rem !important;
}

.g-4 {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 1.5rem;
}</field>
  </block>

  <!-- Single Content Card -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Single Content Card -->
&lt;div class="card"&gt;
  &lt;div class="card-body"&gt;
    &lt;h3&gt;Card Title&lt;/h3&gt;
    &lt;p&gt;This is a simple content card with some &lt;strong&gt;formatted&lt;/strong&gt; text and an &lt;em&gt;emphasized&lt;/em&gt; phrase.&lt;/p&gt;
    &lt;ul&gt;
      &lt;li&gt;List item one&lt;/li&gt;
      &lt;li&gt;List item two&lt;/li&gt;
    &lt;/ul&gt;
    &lt;a href="#"&gt;Read more&lt;/a&gt;
  &lt;/div&gt;
&lt;/div&gt;</field>
  </block>

  <!-- Content Section with Cards -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Content Section with Cards -->
&lt;section class="py-5"&gt;
  &lt;div class="container"&gt;
    &lt;h2 class="mb-4"&gt;Content Section&lt;/h2&gt;
    &lt;div class="row g-4"&gt;
      &lt;div class="col-md-6"&gt;
        &lt;div class="card h-100 border-0"&gt;
          &lt;div class="card-body"&gt;
            &lt;h3&gt;Left Column&lt;/h3&gt;
            &lt;p&gt;Content for the left column goes here.&lt;/p&gt;
            &lt;img src="https://picsum.photos/400/200" alt="Sample image" style="max-width: 100%; height: auto;"&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      &lt;div class="col-md-6"&gt;
        &lt;div class="card h-100 border-0"&gt;
          &lt;div class="card-body"&gt;
            &lt;h3&gt;Right Column&lt;/h3&gt;
            &lt;p&gt;Content for the right column goes here.&lt;/p&gt;
            &lt;ul&gt;
              &lt;li&gt;Feature one&lt;/li&gt;
              &lt;li&gt;Feature two&lt;/li&gt;
              &lt;li&gt;Feature three&lt;/li&gt;
            &lt;/ul&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/section&gt;</field>
  </block>

</category>`;

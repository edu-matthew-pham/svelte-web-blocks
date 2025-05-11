// Bootstrap Footer Toolbox
export const toolboxXml = `<category name="Bootstrap Footer" colour="60">

  <!-- Basic footer styling -->
  <block type="custom_style_css">
    <field name="CODE">/* Basic footer */
footer {
  padding: 2rem 0;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

.container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 15px;
}</field>
  </block>

  <!-- Footer layout -->
  <block type="custom_style_css">
    <field name="CODE">/* Footer layout */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
}

.col-left {
  flex: 0 0 33.333%;
  padding: 0 10px;
}

.col-right {
  flex: 0 0 66.667%;
  padding: 0 10px;
}

@media (max-width: 768px) {
  .col-left, .col-right {
    flex: 0 0 100%;
    margin-bottom: 1rem;
  }
}</field>
  </block>

  <!-- Utility classes -->
  <block type="custom_style_css">
    <field name="CODE">/* Utility classes */
.text-end {
  text-align: right;
}

.d-flex {
  display: flex;
}

.justify-content-end {
  justify-content: flex-end;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-3 {
  gap: 1rem;
}

.small {
  font-size: 0.875rem;
}

.mb-0 {
  margin-bottom: 0;
}</field>
  </block>

  <!-- Link styling -->
  <block type="custom_style_css">
    <field name="CODE">/* Link styling */
.footer-link {
  text-decoration: none;
  color: #6c757d;
  margin: 0 0.5rem;
  transition: color 0.15s ease-in-out;
}

.footer-link:hover {
  color: #495057;
}</field>
  </block>

  <!-- Simple Footer -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE">&lt;!-- Simple Footer --&gt;
&lt;footer&gt;
  &lt;div class="container"&gt;
    &lt;div class="row"&gt;
      &lt;div class="col-left"&gt;
        &lt;p class="small mb-0"&gt;© 2023 My Company. All Rights Reserved.&lt;/p&gt;
      &lt;/div&gt;
      &lt;div class="col-right"&gt;
        &lt;div class="d-flex justify-content-end flex-wrap gap-3"&gt;
          &lt;a href="/privacy" class="footer-link"&gt;Privacy Policy&lt;/a&gt;
          &lt;a href="/terms" class="footer-link"&gt;Terms of Service&lt;/a&gt;
          &lt;a href="/contact" class="footer-link"&gt;Contact Us&lt;/a&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/footer&gt;</field>
  </block>

  <!-- Two-Row Footer -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE">&lt;!-- Two-Row Footer --&gt;
&lt;footer&gt;
  &lt;div class="container"&gt;
    &lt;div class="row" style="margin-bottom: 1.5rem;"&gt;
      &lt;div class="col-left"&gt;
        &lt;h3&gt;My Company&lt;/h3&gt;
        &lt;p&gt;Making the web better, one site at a time.&lt;/p&gt;
      &lt;/div&gt;
      &lt;div class="col-right"&gt;
        &lt;div class="d-flex justify-content-end flex-wrap gap-3"&gt;
          &lt;a href="/about" class="footer-link"&gt;About&lt;/a&gt;
          &lt;a href="/services" class="footer-link"&gt;Services&lt;/a&gt;
          &lt;a href="/blog" class="footer-link"&gt;Blog&lt;/a&gt;
          &lt;a href="/contact" class="footer-link"&gt;Contact&lt;/a&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    &lt;hr style="margin: 1rem 0; opacity: 0.2;"&gt;
    &lt;div class="row"&gt;
      &lt;div class="col-left"&gt;
        &lt;p class="small mb-0"&gt;© 2023 My Company. All Rights Reserved.&lt;/p&gt;
      &lt;/div&gt;
      &lt;div class="col-right"&gt;
        &lt;div class="d-flex justify-content-end flex-wrap gap-3"&gt;
          &lt;a href="/privacy" class="footer-link small"&gt;Privacy&lt;/a&gt;
          &lt;a href="/terms" class="footer-link small"&gt;Terms&lt;/a&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/footer&gt;</field>
  </block>

</category>`;

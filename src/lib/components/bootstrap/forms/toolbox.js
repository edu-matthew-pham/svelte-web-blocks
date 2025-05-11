// Bootstrap Forms Toolbox
export const toolboxXml = `<category name="Bootstrap Forms" colour="260">

  <!-- Form controls and layouts -->
  <block type="custom_style_css">
    <field name="CODE">/* Form controls */
.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

/* Form labels */
.form-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  display: inline-block;
}

/* Spacing utilities */
.mb-3 { margin-bottom: 1rem !important; }
.mt-4 { margin-top: 1.5rem !important; }
.p-4 { padding: 1.5rem !important; }
.text-center { text-align: center !important; }

/* Layout utilities */
.d-grid { display: grid !important; }
.card { border: 1px solid rgba(0,0,0,.125); border-radius: 0.25rem; padding: 1.25rem; }
</field>
  </block>

  <!-- Buttons -->
  <block type="custom_style_css">
    <field name="CODE">/* Form buttons */
.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0069d9;
}</field>
  </block>

  <!-- Form containers -->
  <block type="custom_style_css">
    <field name="CODE">/* Containers */
.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  max-width: 1140px;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.justify-content-center {
  justify-content: center !important;
}

.col-md-8 { width: 66.67%; }
.col-lg-6 { width: 50%; }

@media (max-width: 768px) {
  .col-md-8, .col-lg-6 { width: 100%; }
}</field>
  </block>

  <!-- Basic Form Field -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Basic Form Field -->
&lt;div class="mb-3"&gt;
  &lt;label for="field-name" class="form-label"&gt;Name&lt;/label&gt;
  &lt;input type="text" class="form-control" id="field-name"&gt;
&lt;/div&gt;</field>
  </block>

  <!-- Form Field with Required -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Required Form Field -->
&lt;div class="mb-3"&gt;
  &lt;label for="field-email" class="form-label"&gt;Email *&lt;/label&gt;
  &lt;input type="email" class="form-control" id="field-email" required&gt;
&lt;/div&gt;</field>
  </block>

  <!-- Text Area Field -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Text Area Field -->
&lt;div class="mb-3"&gt;
  &lt;label for="field-message" class="form-label"&gt;Message&lt;/label&gt;
  &lt;textarea class="form-control" id="field-message" rows="3"&gt;&lt;/textarea&gt;
&lt;/div&gt;</field>
  </block>

  <!-- Form Submit Button -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Form Submit Button -->
&lt;div class="d-grid mt-4"&gt;
  &lt;button type="submit" class="btn btn-primary"&gt;Submit&lt;/button&gt;
&lt;/div&gt;</field>
  </block>

  <!-- Complete Contact Form -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Complete Contact Form -->
&lt;section class="py-5"&gt;
  &lt;div class="container"&gt;
    &lt;div class="row justify-content-center"&gt;
      &lt;div class="col-md-8 col-lg-6"&gt;
        &lt;div class="card shadow-sm border-0"&gt;
          &lt;div class="card-body p-4 p-md-5"&gt;
            &lt;h2 class="text-center mb-4"&gt;Contact Us&lt;/h2&gt;
            &lt;form id="contact-form"&gt;
              &lt;div class="mb-3"&gt;
                &lt;label for="field-name" class="form-label"&gt;Name *&lt;/label&gt;
                &lt;input type="text" class="form-control" id="field-name" required&gt;
              &lt;/div&gt;
              &lt;div class="mb-3"&gt;
                &lt;label for="field-email" class="form-label"&gt;Email *&lt;/label&gt;
                &lt;input type="email" class="form-control" id="field-email" required&gt;
              &lt;/div&gt;
              &lt;div class="mb-3"&gt;
                &lt;label for="field-message" class="form-label"&gt;Message *&lt;/label&gt;
                &lt;textarea class="form-control" id="field-message" rows="3" required&gt;&lt;/textarea&gt;
              &lt;/div&gt;
              &lt;div class="d-grid mt-4"&gt;
                &lt;button type="submit" class="btn btn-primary"&gt;Send&lt;/button&gt;
              &lt;/div&gt;
            &lt;/form&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/section&gt;</field>
  </block>

  <!-- Simple Newsletter Form -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Simple Newsletter Form -->
&lt;div class="card p-4"&gt;
  &lt;h3 class="mb-3"&gt;Subscribe to Newsletter&lt;/h3&gt;
  &lt;form id="newsletter-form"&gt;
    &lt;div class="mb-3"&gt;
      &lt;label for="subscriber-email" class="form-label"&gt;Email Address *&lt;/label&gt;
      &lt;input type="email" class="form-control" id="subscriber-email" required&gt;
    &lt;/div&gt;
    &lt;div class="d-grid"&gt;
      &lt;button type="submit" class="btn btn-primary"&gt;Subscribe&lt;/button&gt;
    &lt;/div&gt;
  &lt;/form&gt;
&lt;/div&gt;</field>
  </block>

</category>`;

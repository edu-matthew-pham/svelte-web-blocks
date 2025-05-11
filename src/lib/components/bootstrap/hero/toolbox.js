// Bootstrap Hero Toolbox
export const toolboxXml = `<category name="Bootstrap Hero" colour="160">

  <!-- Container -->
  <block type="custom_style_css">
    <field name="CODE">/* Basic container */
.container {
  width: 100%;
  max-width: 1140px;
  margin-right: auto;
  margin-left: auto;
}</field>
  </block>

  <!-- Row and Columns -->
  <block type="custom_style_css">
    <field name="CODE">/* Row and columns */
.row {
  display: flex;
  flex-wrap: wrap;
}

.col {
  position: relative;
  flex-grow: 1;
}</field>
  </block>

  <!-- Button Styles -->
  <block type="custom_style_css">
    <field name="CODE">/* Button styles */
.btn {
  display: inline-block;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}
  </field>
  </block>
  
 <!-- Basic typography -->
  <block type="custom_style_css">
    <field name="CODE">/* Typography utilities */
.text-center {
  text-align: center;
}
  
.display-3 {
  font-size: 2.5rem;
  font-weight: 300;
  line-height: 1.2;
}

.lead {
  font-size: 1.25rem;
  font-weight: 300;
}
  </field>
  </block>

  <!-- Simple Hero Section HTML -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Simple Bootstrap Hero Section -->
&lt;section&gt;
  &lt;div class="container"&gt;
    &lt;div class="row"&gt;
      &lt;div class="col"&gt;
        &lt;h1 class="display-3"&gt;Welcome to Our Website&lt;/h1&gt;
        &lt;p class="lead"&gt;We provide the best solutions for your business&lt;/p&gt;
        &lt;a href="#" class="btn btn-primary"&gt;Get Started&lt;/a&gt;
        &lt;a href="#" class="btn btn-secondary"&gt;Learn more&lt;/a&gt;
      &lt;/div&gt;
      &lt;div class="col"&gt;
        &lt;img src="https://picsum.photos/id/28/600/400" alt="Hero image" style="max-width: 100%; height: auto;"&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/section&gt;</field>
  </block>

  <!-- Centered Hero Section HTML -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Centered Bootstrap Hero Section -->
&lt;section&gt;
  &lt;div class="container"&gt;
    &lt;div class="row"&gt;
      &lt;div class="col text-center"&gt;
        &lt;h1 class="display-3"&gt;Simple Hero Section&lt;/h1&gt;
        &lt;p class="lead"&gt;A clean and simple hero section for your website&lt;/p&gt;
        &lt;a href="#" class="btn btn-primary"&gt;Get Started&lt;/a&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/section&gt;</field>
  </block>

</category>`;

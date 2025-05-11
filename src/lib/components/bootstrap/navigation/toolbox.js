// Bootstrap Navigation Toolbox
export const toolboxXml = `<category name="Bootstrap Navigation" colour="41">

  <!-- Navbar container -->
  <block type="custom_style_css">
    <field name="CODE">/* Navbar container */
.navbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: rgba(100,200,200,0.2);
}</field>
  </block>

  <!-- Navigation list -->
  <block type="custom_style_css">
    <field name="CODE">/* Navigation list */
.navbar-nav {
  display: flex;
  padding-left: 0;
  margin: 0;
  list-style: none;
}</field>
  </block>

  <!-- Navigation item -->
  <block type="custom_style_css">
    <field name="CODE">/* Navigation item */
.nav-item {
  margin: 0 0.25rem;
}</field>
  </block>

  <!-- Navigation link -->
  <block type="custom_style_css">
    <field name="CODE">/* Navigation link */
.nav-link {
  display: block;
  padding: 0.5rem;
  color: #333;
  text-decoration: none;
  transition: color 0.15s ease-in-out;
}

.nav-link:hover {
  color: #0066cc;
}</field>
  </block>

  <!-- Responsive behavior -->
  <block type="custom_style_css">
    <field name="CODE">/* Simple responsive behavior */
@media (max-width: 768px) {
  .navbar-nav {
    flex-direction: column;
    width: 100%;
  }
  
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }
}</field>
  </block>

  <!-- Complete navbar example HTML -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Simple Bootstrap-style Navigation -->
&lt;nav class="navbar"&gt;
  &lt;a href="#" style="font-weight: bold; font-size: 1.25rem;"&gt;My Website&lt;/a&gt;
  &lt;ul class="navbar-nav"&gt;
    &lt;li class="nav-item"&gt;
      &lt;a href="#" class="nav-link"&gt;Home&lt;/a&gt;
    &lt;/li&gt;
    &lt;li class="nav-item"&gt;
      &lt;a href="#" class="nav-link"&gt;About&lt;/a&gt;
    &lt;/li&gt;
    &lt;li class="nav-item"&gt;
      &lt;a href="#" class="nav-link"&gt;Contact&lt;/a&gt;
    &lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;</field>
  </block>

</category>`;

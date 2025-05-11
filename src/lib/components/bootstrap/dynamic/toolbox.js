// Components Toolbox (Gallery & Accordion)
export const toolboxXml = `<category name="Components" colour="120">

  <!-- Component styles -->
  <block type="custom_style_css">
    <field name="CODE">/* Gallery and common styles */
.container {
  width: 100%;
  max-width: 1140px;
  margin-right: auto;
  margin-left: auto;
  padding: 0 15px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
}

.col-6 {
  width: 50%;
  padding: 0 15px;
}

.col-md-4 {
  width: 33.333%;
  padding: 0 15px;
}

.mb-4 { margin-bottom: 1.5rem; }
.mb-5 { margin-bottom: 3rem; }
.py-5 { padding: 3rem 0; }
.text-center { text-align: center; }

.card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  border-radius: 0.25rem;
  overflow: hidden;
}

.border-0 { border: 0 !important; }
.shadow-sm { box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); }
.card-body { padding: 1rem; }
.card-img-top { width: 100%; }

@media (max-width: 768px) {
  .col-md-4 { width: 50%; }
}

@media (max-width: 576px) {
  .col-md-4 { width: 100%; }
}</field>
  </block>

  <!-- Modal styles -->
  <block type="custom_style_css">
    <field name="CODE">/* Modal and carousel styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal.show { display: flex; }

.modal-dialog {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 1.75rem auto;
}

.modal-content {
  position: relative;
  background-color: transparent;
}

.modal-body { position: relative; }

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  margin: 1rem;
  padding: 0.5rem;
  background-color: white;
  border-radius: 50%;
  border: none;
  cursor: pointer;
}

.carousel {
  position: relative;
}

.carousel-item {
  display: none;
}

.carousel-item.active {
  display: block;
}

.carousel-control-prev,
.carousel-control-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  color: white;
}

.carousel-control-prev { left: 10px; }
.carousel-control-next { right: 10px; }

.w-100 { width: 100%; }
.rounded { border-radius: 0.25rem; }</field>
  </block>

  <!-- Accordion styles -->
  <block type="custom_style_css">
    <field name="CODE">/* Accordion styles */
.accordion {
  border: 1px solid rgba(0,0,0,.125);
  border-radius: 0.25rem;
}

.accordion-item {
  border-bottom: 1px solid rgba(0,0,0,.125);
}

.accordion-item:last-child {
  border-bottom: 0;
}

.accordion-header {
  margin: 0;
}

.accordion-button {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  background-color: #fff;
  border: 0;
  border-radius: 0;
  overflow-anchor: none;
  cursor: pointer;
}

.accordion-button:not(.collapsed) {
  color: #0c63e4;
  background-color: #e7f1ff;
}

.accordion-button::after {
  content: '+';
  margin-left: auto;
}

.accordion-button:not(.collapsed)::after {
  content: '-';
}

.accordion-collapse {
  height: 0;
  overflow: hidden;
  transition: height 0.35s ease;
}

.accordion-collapse.show {
  height: auto;
}

.accordion-body {
  padding: 1rem 1.25rem;
}</field>
  </block>

  <!-- Image Gallery -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Simple Image Gallery -->
&lt;section class="py-5"&gt;
  &lt;div class="container"&gt;
    &lt;h2 class="text-center mb-5"&gt;Image Gallery&lt;/h2&gt;
    &lt;div class="row" id="gallery-123"&gt;
      
      &lt;div class="col-6 col-md-4 mb-4"&gt;
        &lt;div class="card border-0 shadow-sm h-100"&gt;
          &lt;a href="#" class="gallery-item" data-id="0"&gt;
            &lt;img src="https://picsum.photos/id/1/800/600" alt="Image 1" class="card-img-top img-fluid" style="aspect-ratio: 4/3; object-fit: cover;"&gt;
          &lt;/a&gt;
          &lt;div class="card-body"&gt;
            &lt;p class="card-text"&gt;Mountain View&lt;/p&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      
      &lt;div class="col-6 col-md-4 mb-4"&gt;
        &lt;div class="card border-0 shadow-sm h-100"&gt;
          &lt;a href="#" class="gallery-item" data-id="1"&gt;
            &lt;img src="https://picsum.photos/id/10/800/600" alt="Image 2" class="card-img-top img-fluid" style="aspect-ratio: 4/3; object-fit: cover;"&gt;
          &lt;/a&gt;
          &lt;div class="card-body"&gt;
            &lt;p class="card-text"&gt;Ocean Waves&lt;/p&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      
      &lt;div class="col-6 col-md-4 mb-4"&gt;
        &lt;div class="card border-0 shadow-sm h-100"&gt;
          &lt;a href="#" class="gallery-item" data-id="2"&gt;
            &lt;img src="https://picsum.photos/id/100/800/600" alt="Image 3" class="card-img-top img-fluid" style="aspect-ratio: 4/3; object-fit: cover;"&gt;
          &lt;/a&gt;
          &lt;div class="card-body"&gt;
            &lt;p class="card-text"&gt;Beach Sunset&lt;/p&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      
    &lt;/div&gt;
  &lt;/div&gt;
  
  &lt;!-- Modal Gallery Viewer --&gt;
  &lt;div class="modal" id="gallery-modal"&gt;
    &lt;div class="modal-dialog"&gt;
      &lt;div class="modal-content"&gt;
        &lt;div class="modal-body"&gt;
          &lt;div class="carousel"&gt;
            &lt;div class="carousel-inner"&gt;
              &lt;div class="carousel-item active" data-id="0"&gt;
                &lt;img src="https://picsum.photos/id/1/800/600" class="d-block w-100 rounded" alt="Mountain View"&gt;
              &lt;/div&gt;
              &lt;div class="carousel-item" data-id="1"&gt;
                &lt;img src="https://picsum.photos/id/10/800/600" class="d-block w-100 rounded" alt="Ocean Waves"&gt;
              &lt;/div&gt;
              &lt;div class="carousel-item" data-id="2"&gt;
                &lt;img src="https://picsum.photos/id/100/800/600" class="d-block w-100 rounded" alt="Beach Sunset"&gt;
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;button class="carousel-control-prev" type="button"&gt;
              &lt;span&gt;&amp;lt;&lt;/span&gt;
            &lt;/button&gt;
            &lt;button class="carousel-control-next" type="button"&gt;
              &lt;span&gt;&amp;gt;&lt;/span&gt;
            &lt;/button&gt;
          &lt;/div&gt;
          &lt;button type="button" class="btn-close" aria-label="Close"&gt;×&lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/section&gt;</field>
  </block>

  <!-- Accordion -->
  <block type="custom_content_html">
    <field name="ID"></field>
    <field name="CLASS"></field>
    <field name="CODE"><!-- Simple Accordion -->
&lt;section class="py-5"&gt;
  &lt;div class="container"&gt;
    &lt;h2 class="text-center mb-5"&gt;Frequently Asked Questions&lt;/h2&gt;
    &lt;div class="accordion" id="accordion-123"&gt;
      
      &lt;div class="accordion-item"&gt;
        &lt;h2 class="accordion-header"&gt;
          &lt;button class="accordion-button" type="button" data-target="#collapse-1"&gt;
            How do I get started?
          &lt;/button&gt;
        &lt;/h2&gt;
        &lt;div id="collapse-1" class="accordion-collapse show"&gt;
          &lt;div class="accordion-body"&gt;
            Sign up for an account and follow our simple onboarding process.
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      
      &lt;div class="accordion-item"&gt;
        &lt;h2 class="accordion-header"&gt;
          &lt;button class="accordion-button collapsed" type="button" data-target="#collapse-2"&gt;
            Is there a free trial?
          &lt;/button&gt;
        &lt;/h2&gt;
        &lt;div id="collapse-2" class="accordion-collapse"&gt;
          &lt;div class="accordion-body"&gt;
            Yes, we offer a 14-day free trial with all features included.
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      
      &lt;div class="accordion-item"&gt;
        &lt;h2 class="accordion-header"&gt;
          &lt;button class="accordion-button collapsed" type="button" data-target="#collapse-3"&gt;
            How does billing work?
          &lt;/button&gt;
        &lt;/h2&gt;
        &lt;div id="collapse-3" class="accordion-collapse"&gt;
          &lt;div class="accordion-body"&gt;
            We offer monthly and annual subscription plans with various tiers.
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/section&gt;</field>
  </block>

  <!-- Component Utility Scripts -->
  <block type="custom_script_js">
    <field name="CODE">// Gallery and Accordion utility functions
// Navigation function for gallery carousel
function navigateGallery(activeIndex, direction, carouselItems) {
  if (!carouselItems || carouselItems.length === 0) return activeIndex;
  
  carouselItems[activeIndex].classList.remove('active');
  const newIndex = (activeIndex + direction + carouselItems.length) % carouselItems.length;
  carouselItems[newIndex].classList.add('active');
  
  return newIndex;
}

// Toggle accordion item
function toggleAccordion(button, target) {
  if (button.classList.contains('collapsed')) {
    button.classList.remove('collapsed');
    target.classList.add('show');
  } else {
    button.classList.add('collapsed');
    target.classList.remove('show');
  }
}</field>
  </block>

  <!-- Component Initialization (OnLoad) -->
  <block type="custom_onload_js">
    <field name="CODE">// Initialize gallery and accordion components
// Note: This code runs when the document is loaded

// Gallery modal functionality
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('gallery-modal');
const closeBtn = modal?.querySelector('.btn-close');
const carouselItems = modal?.querySelectorAll('.carousel-item');
const prevBtn = modal?.querySelector('.carousel-control-prev');
const nextBtn = modal?.querySelector('.carousel-control-next');
let activeIndex = 0;

// Open modal and show correct slide
galleryItems.forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    const slideId = this.getAttribute('data-id');
    if (modal && carouselItems) {
      modal.classList.add('show');
      carouselItems.forEach(slide => {
        slide.classList.remove('active');
        if (slide.getAttribute('data-id') === slideId) {
          slide.classList.add('active');
          activeIndex = parseInt(slideId) || 0;
        }
      });
    }
  });
});

// Close modal
if (closeBtn) {
  closeBtn.addEventListener('click', function() {
    modal.classList.remove('show');
  });
}

// Carousel navigation
if (prevBtn) {
  prevBtn.addEventListener('click', function() {
    activeIndex = navigateGallery(activeIndex, -1, carouselItems);
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', function() {
    activeIndex = navigateGallery(activeIndex, 1, carouselItems);
  });
}

// Accordion functionality
const accordionButtons = document.querySelectorAll('.accordion-button');

accordionButtons.forEach(button => {
  button.addEventListener('click', function() {
    const target = document.querySelector(this.getAttribute('data-target'));
    if (target) {
      toggleAccordion(this, target);
    }
  });
});</field>
  </block>

</category>`;

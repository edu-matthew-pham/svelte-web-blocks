import type { ComponentAttributes } from '../utils/generator-factory.js';

import type { DynamicCardItem } from '../types.js';
import pkg from 'js-beautify';
const {html} = pkg;

/**
 * Creates HTML for a grid or list of cards based on provided data
 * @param dataItems Array of items containing icon, title, and description
 * @param layout 'grid' or 'list' layout
 * @param columns Number of columns in grid layout
 * @returns Formatted HTML string
 */
export function createCardsHTML(dataItems: DynamicCardItem[], layout: string, columns: number): string {
  return dataItems.map((item) => `
    <div class="card">
      <div class="card-body">
        <div class="card-icon">${item.icon || '🔍'}</div>
        <h3 class="card-title">${item.title || 'Title'}</h3>
        <p class="card-text">${item.description || 'Description'}</p>
      </div>
    </div>
  `).join('\n');
}

/**
 * Creates HTML for carousel slides
 * @param dataItems Array of items to display in carousel
 * @param itemsPerSlide Number of items to show per slide
 * @returns Formatted HTML string for carousel slides
 */
export function createCarouselSlidesHTML(dataItems: DynamicCardItem[], itemsPerSlide: number): string {
  const slides = [];
  
  for (let i = 0; i < dataItems.length; i += itemsPerSlide) {
    const slideItems = dataItems.slice(i, i + itemsPerSlide);
    const slideHtml = `
      <div class="carousel-slide" data-slide="${i/itemsPerSlide}">
        <div class="carousel-row">
          ${slideItems.map((item) => `
            <div class="carousel-item">
              <div class="card">
                <div class="card-icon">${item.icon || '🔍'}</div>
                <h3 class="card-title">${item.title || 'Title'}</h3>
                <p class="card-text">${item.description || 'Description'}</p>
              </div>
            </div>
          `).join('\n')}
        </div>
      </div>`;
    slides.push(slideHtml);
  }
  
  return slides.join('\n');
}

/**
 * Creates HTML for carousel indicators
 * @param componentId ID of the carousel component
 * @param slideCount Number of slides
 * @returns Formatted HTML string for carousel indicators
 */
export function createCarouselIndicatorsHTML(componentId: string, slideCount: number): string {
  if (slideCount <= 1) return '';
  
  return `
    <div class="carousel-indicators">
      ${Array.from({length: slideCount}, (_, i) => `
        <button type="button" data-target="${componentId}" data-slide-to="${i}" 
          ${i === 0 ? 'class="active"' : ''} 
          aria-label="Slide ${i+1}"></button>
      `).join('')}
    </div>
  `;
}

/**
 * Creates HTML for the document structure
 * @param title Document title
 * @param theme Theme name (unused in raw HTML version)
 * @param content Inner page content
 * @param scripts JavaScript code
 * @param styles CSS styles to be included
 * @param onloadScripts JavaScript code for onload functionality
 * @param attributes Optional ID, class and data attributes
 * @returns Complete HTML document
 */
export function createDocumentHTML(
  title: string,
  theme: string,
  content: string, 
  scripts: string,
  styles: string = '',
  onloadScripts: string = '',
  attributes: ComponentAttributes
): string {
  // Build HTML attributes from provided data
  const bodyId = attributes.id ? ` id="${attributes.id}"` : '';
  const bodyClass = attributes.className ? ` class="${attributes.className}"` : '';
  const bodyData = attributes.dataAttributes ? ` ${attributes.dataAttributes}` : '';

  const htmlString = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- @BEGIN: STYLE_BLOCKS -->
  <style>
    ${styles}
  </style>
  <!-- @END: STYLE_BLOCKS -->
</head>
<body${bodyId}${bodyClass}${bodyData}>
  
  <!-- @BEGIN: CONTENT_BLOCKS -->
  ${content}
  <!-- @END: CONTENT_BLOCKS -->
  
  <!-- @BEGIN: SCRIPT_BLOCKS -->
  <script>
    ${scripts}
  </script>
  <!-- @END: SCRIPT_BLOCKS -->

  <!-- @BEGIN: ONLOAD_SCRIPTS -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');
    ${onloadScripts}
  });
  </script>
  <!-- @END: ONLOAD_SCRIPTS -->

</body>
</html>`;

  // Format the final HTML
  return html(htmlString, {
    indent_size: 2,
    indent_inner_html: true,
    wrap_line_length: 0,
    preserve_newlines: true,
    max_preserve_newlines: 1,
  });
}

/**
 * Creates HTML for the header component
 * @param logoText Text for the logo/brand
 * @param includeSignup Whether to include signup button
 * @param navigationItems HTML string for navigation items
 * @param attributes Optional ID, class and data attributes
 * @returns HTML for header component
 */
export function createHeaderHTML(
  logoText: string,
  includeSignup: boolean,
  navigationItems: string,
  attributes: ComponentAttributes = {}
): string {
  // Build HTML attributes
  const id = attributes.id ? ` id="${attributes.id}"` : '';
  const className = attributes.className ? ` class="${attributes.className}"` : ' class="site-header"';
  const dataAttributes = attributes.dataAttributes ? ` ${attributes.dataAttributes}` : '';

  return `<!-- @component: Header -->
<header${id}${className}${dataAttributes}>
  <div class="container">
    <a class="logo" href="/">${logoText}</a>
    <button class="nav-toggle" aria-controls="primary-nav" aria-expanded="false">
      <span class="sr-only">Menu</span>
      <span class="hamburger"></span>
    </button>
    <nav id="primary-nav">
      <ul class="nav-list">
        ${navigationItems}
      </ul>
      ${includeSignup ? `<div class="signup-container">
        <a href="/signup" class="signup-button">Sign Up</a>
      </div>` : ''}
    </nav>
  </div>
</header>`;
}

/**
 * Creates HTML for the hero component
 * @param headline Main headline
 * @param subheadline Secondary headline
 * @param buttonText Primary button text
 * @param buttonUrl Primary button URL
 * @param hasImage Whether to include an image
 * @param imageUrl URL of the image if hasImage is true
 * @param attributes Optional ID, class and data attributes
 * @returns HTML for hero component
 */
export function createHeroHTML(
  headline: string,
  subheadline: string,
  buttonText: string,
  buttonUrl: string,
  hasImage: boolean,
  imageUrl: string = '',
  attributes: ComponentAttributes = {}
): string {
  // Build HTML attributes
  const id = attributes.id ? ` id="${attributes.id}"` : '';
  const className = attributes.className ? ` class="${attributes.className}"` : ' class="hero"';
  const dataAttributes = attributes.dataAttributes ? ` ${attributes.dataAttributes}` : '';

  return `<!-- @component: Hero -->
<section${id}${className}${dataAttributes}>
  <div class="container">
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-headline">${headline}</h1>
        <p class="hero-subheadline">${subheadline}</p>
        <div class="hero-buttons">
          <a href="${buttonUrl}" class="primary-button">${buttonText}</a>
          <a href="#features" class="secondary-button">Learn more</a>
        </div>
      </div>
      ${hasImage ? `<div class="hero-image">
        <img src="${imageUrl}" alt="Hero image">
      </div>` : ''}
    </div>
  </div>
</section>`;
}

/**
 * Creates HTML for a navigation item
 * @param text Text for the navigation link
 * @param url URL for the navigation link
 * @param attributes Optional ID, class and data attributes
 * @returns HTML for navigation item
 */
export function createNavItemHTML(
  text: string, 
  url: string,
  attributes: ComponentAttributes = {}
): string {
  // Build HTML attributes
  const id = attributes.id ? ` id="${attributes.id}"` : '';
  const className = attributes.className ? ` class="${attributes.className}"` : ' class="nav-item"';
  const dataAttributes = attributes.dataAttributes ? ` ${attributes.dataAttributes}` : '';

  return `<!-- @item: NavItem -->
<li${id}${className}${dataAttributes}>
  <a class="nav-link" href="${url}">${text}</a>
</li>\n`;
}

/**
 * Creates HTML for feature cards section
 * @param title Section title
 * @param backgroundColor Background color value
 * @param features HTML string for feature cards
 * @param attributes Optional ID, class and data attributes
 * @returns HTML for feature cards section
 */
export function createFeatureCardsHTML(
  title: string, 
  backgroundColor: string, 
  features: string,
  attributes: ComponentAttributes = {}
): string {
  // Build HTML attributes
  const id = attributes.id ? ` id="${attributes.id}"` : '';
  const className = attributes.className ? ` class="${attributes.className}"` : ' class="feature-section"';
  const dataAttributes = attributes.dataAttributes ? ` ${attributes.dataAttributes}` : '';

  return `<!-- @component: FeatureCards -->
<section${id}${className}${dataAttributes}>
  <div class="container">
    <h2 class="section-title">${title}</h2>
    <div class="feature-grid">
      ${features}
    </div>
  </div>
</section>\n`;
}

/**
 * Creates HTML for a feature card
 * @param icon Icon character or emoji
 * @param title Card title
 * @param description Card description
 * @param columns Number of columns in the grid (unused in raw HTML)
 * @param attributes Optional ID, class and data attributes
 * @returns HTML for feature card
 */
export function createFeatureCardHTML(
  icon: string, 
  title: string, 
  description: string, 
  columns: number,
  attributes: ComponentAttributes = {}
): string {
  return `<!-- @item: FeatureCard -->
<div class="feature-card">
  <div class="feature-icon">${icon}</div>
  <h3 class="feature-title">${title}</h3>
  <p class="feature-text">${description}</p>
</div>\n`;
}

/**
 * Creates HTML for content section
 * @param headline Section headline
 * @param contentBlocks HTML string for content blocks
 * @param attributes Optional ID, class and data attributes
 * @returns HTML for content section
 */
export function createContentSectionHTML(headline: string, contentBlocks: string, attributes: ComponentAttributes = {}): string {
  // Build HTML attributes
  const id = attributes.id ? ` id="${attributes.id}"` : '';
  const className = attributes.className ? ` class="${attributes.className}"` : ' class="content-section"';
  const dataAttributes = attributes.dataAttributes ? ` ${attributes.dataAttributes}` : '';

  return `<!-- @component: ContentSection -->
<section${id}${className}${dataAttributes}>
  <div class="container">
    <h2 class="section-title">${headline}</h2>
    <div class="content-grid">
      ${contentBlocks}
    </div>
  </div>
</section>\n`;
}

/**
 * Creates HTML for a content block
 * @param htmlContent HTML content (converted from markdown)
 * @param columns Number of columns (unused in raw HTML)
 * @param attributes Optional ID, class and data attributes
 * @returns HTML for content block
 */
export function createContentBlockHTML(htmlContent: string, columns: number, attributes: ComponentAttributes = {}): string {
  // Build HTML attributes
  const id = attributes.id ? ` id="${attributes.id}"` : '';
  const className = attributes.className ? ` class="${attributes.className}"` : ' class="content-block"';
  const dataAttributes = attributes.dataAttributes ? ` ${attributes.dataAttributes}` : '';

  return `<!-- @item: ContentBlock -->
<div${id}${className}${dataAttributes}>
  <div class="content-card">
    <div class="content-body">
${htmlContent}
    </div>
  </div>
</div>\n`;
}

/**
 * Creates HTML for a form field based on field type
 * @param id Field ID (fallback if not provided in attributes)
 * @param label Field label
 * @param type Field type
 * @param required Whether field is required
 * @param options Options for select or radio fields
 * @param attributes Additional HTML attributes for the input element (id, className)
 * @param containerAttributes Optional attributes for the container div
 * @returns HTML for the form field
 */
export function createFormFieldHTML(
  id: string, 
  label: string, 
  type: string, 
  required: boolean, 
  options: string[] = [],
  attributes?: { id?: string, className?: string },
  containerAttributes: ComponentAttributes = {}
): string {
  // Use attributes.id if provided, otherwise use the id parameter
  const fieldId = attributes?.id || id;
  const className = attributes?.className ? ` class="${attributes.className}"` : '';
  
  // Container attributes
  const containerId = containerAttributes.id ? ` id="${containerAttributes.id}"` : '';
  const containerClass = containerAttributes.className ? ` class="${containerAttributes.className}"` : ' class="form-field"';
  const dataAttributes = containerAttributes.dataAttributes ? ` ${containerAttributes.dataAttributes}` : '';
  
  switch(type) {
    case 'text':
    case 'email':
    case 'number':
    case 'tel':
    case 'date':
    case 'time':
      return `<!-- @item: FormField -->
<div${containerId}${containerClass}${dataAttributes}>
  <label for="${fieldId}">${label}${required ? ' *' : ''}</label>
  <input type="${type}"${className} id="${fieldId}" name="${fieldId}" ${required ? 'required' : ''}>
</div>\n`;
      
    case 'textarea':
      return `<!-- @item: FormField -->
<div${containerId}${containerClass}${dataAttributes}>
  <label for="${fieldId}">${label}${required ? ' *' : ''}</label>
  <textarea${className} id="${fieldId}" name="${fieldId}" rows="3" ${required ? 'required' : ''}></textarea>
</div>\n`;
      
    case 'checkbox':
      return `<!-- @item: FormField -->
<div${containerId}${containerClass}${dataAttributes}>
  <input type="checkbox" id="${fieldId}" name="${fieldId}" ${required ? 'required' : ''}>
  <label for="${fieldId}">${label}${required ? ' *' : ''}</label>
</div>\n`;
      
    case 'radio':
      return `<!-- @item: FormField -->
<div${containerId}${containerClass}${dataAttributes}>
  <fieldset>
    <legend>${label}${required ? ' *' : ''}</legend>
    ${options.map((option, i) => `
    <div class="radio-option">
      <input type="radio" id="${fieldId}-${i}" name="${fieldId}" value="${option.toLowerCase().replace(/\s+/g, '-')}" ${required && i === 0 ? 'required' : ''}>
      <label for="${fieldId}-${i}">${option}</label>
    </div>`).join('\n')}
  </fieldset>
</div>\n`;
      
    case 'select':
      return `<!-- @item: FormField -->
<div${containerId}${containerClass}${dataAttributes}>
  <label for="${fieldId}">${label}${required ? ' *' : ''}</label>
  <select id="${fieldId}" name="${fieldId}"${className} ${required ? 'required' : ''}>
    <option value="" selected disabled>Please select...</option>
    ${options.map(option => `<option value="${option.toLowerCase().replace(/\s+/g, '-')}">${option}</option>`).join('\n    ')}
  </select>
</div>\n`;
    
    default:
      return '';
  }
}

/**
 * Creates HTML for a basic form
 * @param title Form title
 * @param submitText Submit button text
 * @param formFields HTML string for form fields
 * @param attributes Additional HTML attributes (id, className) 
 * @returns HTML for form component
 */
export function createFormHTML(
  title: string, 
  submitText: string, 
  formFields: string,
  attributes?: { id?: string, className?: string }
): string {
  const id = attributes?.id ? ` id="${attributes.id}"` : '';
  const className = attributes?.className ? ` class="${attributes.className}"` : ' class="form-component"';
  
  return `<!-- @component: Form -->
<section class="form-section">
  <div class="container">
    <div class="form-container">
      <h2 class="form-title">${title}</h2>
      <form${id}${className}>
        ${formFields}
        <div class="form-submit">
          <button type="submit" class="submit-button">${submitText}</button>
        </div>
      </form>
    </div>
  </div>
</section>\n`;
}

/**
 * Creates HTML for footer component
 * @param copyright Copyright text
 * @param links HTML string for footer links
 * @param attributes Optional ID, class and data attributes
 * @returns HTML for footer component
 */
export function createFooterHTML(copyright: string, links: string, attributes: ComponentAttributes = {}): string {
  // Build HTML attributes
  const id = attributes.id ? ` id="${attributes.id}"` : '';
  const className = attributes.className ? ` class="${attributes.className}"` : ' class="site-footer"';
  const dataAttributes = attributes.dataAttributes ? ` ${attributes.dataAttributes}` : '';

  return `<!-- @component: Footer -->
<footer${id}${className}${dataAttributes}>
  <div class="container">
    <div class="footer-content">
      <div class="copyright">
        <p>${copyright}</p>
      </div>
      <div class="footer-links">
        ${links}
      </div>
    </div>
  </div>
</footer>\n`;
}

/**
 * Creates HTML for a footer link
 * @param text Link text
 * @param url Link URL
 * @param attributes Optional ID, class and data attributes
 * @returns HTML for footer link
 */
export function createFooterLinkHTML(text: string, url: string, attributes: ComponentAttributes = {}): string {
  // Build HTML attributes
  const id = attributes.id ? ` id="${attributes.id}"` : '';
  const className = attributes.className ? ` class="${attributes.className}"` : ' class="footer-link"';
  const dataAttributes = attributes.dataAttributes ? ` ${attributes.dataAttributes}` : '';

  return `<!-- @item: FooterLink -->
<a href="${url}"${id}${className}${dataAttributes}>${text}</a>\n`;
}

/**
 * Creates HTML for dynamic cards component
 * @param title Section title
 * @param wrapperHtml Wrapper HTML containing cards
 * @param attributes Optional ID, class and data attributes
 * @returns HTML for dynamic cards section
 */
export function createDynamicCardsHTML(
  title: string, 
  wrapperHtml: string, 
  attributes: ComponentAttributes = {}
): string {
  // Build HTML attributes
  const id = attributes.id ? ` id="${attributes.id}"` : '';
  const className = attributes.className ? ` class="${attributes.className}"` : ' class="dynamic-cards"';
  const dataAttributes = attributes.dataAttributes ? ` ${attributes.dataAttributes}` : '';

  return `<!-- @component: DynamicCards -->
<section${id}${className}${dataAttributes}>
  <div class="container">
    <h2 class="section-title">${title}</h2>
    ${wrapperHtml}
  </div>
</section>\n`;
}

/**
 * Creates HTML for carousel wrapper
 * @param componentId Unique ID for the carousel
 * @param slides HTML for carousel slides
 * @param slideCount Number of slides
 * @param indicators HTML for carousel indicators
 * @returns HTML for carousel wrapper
 */
export function createCarouselWrapperHTML(
  componentId: string, 
  slides: string, 
  slideCount: number, 
  indicators: string
): string {
  return `
    <div class="carousel-container">
      <div id="${componentId}" class="carousel">
        <div class="carousel-slides">
          ${slides}
        </div>
        
        ${slideCount > 1 ? `
          <button class="carousel-control carousel-prev" data-target="${componentId}">
            <span class="control-icon">&#8249;</span>
            <span class="sr-only">Previous</span>
          </button>
          <button class="carousel-control carousel-next" data-target="${componentId}">
            <span class="control-icon">&#8250;</span>
            <span class="sr-only">Next</span>
          </button>
        ` : ''}
      </div>
      ${indicators}
    </div>
  `;
}

/**
 * Creates HTML for grid layout wrapper
 * @param cardsHtml HTML string for cards
 * @returns HTML for grid wrapper
 */
export function createGridWrapperHTML(cardsHtml: string): string {
  return `<div class="cards-grid">
    ${cardsHtml}
  </div>`;
}

/**
 * Creates HTML for a gallery thumbnail item
 * @param img Image data object
 * @param index Image index
 * @param sizeClass CSS class for thumbnail size
 * @param enableLightbox Whether lightbox is enabled
 * @param galleryId Gallery ID for lightbox targeting
 * @returns HTML for gallery thumbnail item
 */
export function createGalleryThumbnailHTML(
  img: any, 
  index: number, 
  sizeClass: string, 
  enableLightbox: boolean, 
  galleryId: string
): string {
  return `
        <div class="gallery-item ${sizeClass}">
          <div class="gallery-card">
            <a href="${img.url}" class="${enableLightbox ? 'lightbox-trigger' : ''}" ${enableLightbox ? `data-target="${galleryId}-modal" data-slide-to="${index}"` : 'target="_blank"'}>
              <img src="${img.url}" alt="${img.alt || ''}" class="gallery-image">
            </a>
            ${img.caption ? `
            <div class="gallery-caption">
              <p>${img.caption}</p>
            </div>` : ''}
          </div>
        </div>
      `;
}

/**
 * Creates HTML for lightbox modal
 * @param images Array of image objects
 * @param galleryId Gallery ID for lightbox targeting
 * @returns HTML for lightbox modal
 */
export function createLightboxModalHTML(images: any[], galleryId: string): string {
  return `
        <div id="${galleryId}-modal" class="lightbox-modal">
          <div class="lightbox-content">
            <div id="${galleryId}-carousel" class="lightbox-carousel">
              <div class="lightbox-slides">
                ${images.map((img: any, index: number) => `
                  <div class="lightbox-slide" data-slide="${index}">
                    <img src="${img.url}" alt="${img.alt || ''}">
                    ${img.caption ? `<div class="lightbox-caption"><p>${img.caption}</p></div>` : ''}
                  </div>
                `).join('\n')}
              </div>
              <button class="lightbox-control lightbox-prev" data-target="${galleryId}-carousel">
                <span>&#8249;</span>
              </button>
              <button class="lightbox-control lightbox-next" data-target="${galleryId}-carousel">
                <span>&#8250;</span>
              </button>
            </div>
            <button type="button" class="lightbox-close" data-dismiss="${galleryId}-modal">×</button>
          </div>
        </div>
        `;
}

/**
 * Creates HTML for image gallery component
 * @param title Gallery title
 * @param thumbnailSize Size option for thumbnails ('small', 'medium', 'large')
 * @param enableLightbox Whether lightbox functionality is enabled
 * @param images Array of image objects with url, alt, and caption properties
 * @param attributes Optional ID, class and data attributes
 * @returns HTML for image gallery component
 */
export function createImageGalleryHTML(
  title: string,
  thumbnailSize: string,
  enableLightbox: boolean,
  images: any[],
  attributes: ComponentAttributes = {}
): string {
  // Build HTML attributes
  const id = attributes.id ? ` id="${attributes.id}"` : '';
  const className = attributes.className ? ` class="${attributes.className}"` : ' class="image-gallery"';
  const dataAttributes = attributes.dataAttributes ? ` ${attributes.dataAttributes}` : '';
  
  // Determine thumbnail size class
  let sizeClass;
  switch(thumbnailSize) {
    case 'small': sizeClass = 'gallery-item-small'; break;
    case 'large': sizeClass = 'gallery-item-large'; break;
    default: sizeClass = 'gallery-item-medium'; // medium
  }
  
  // Generate gallery HTML
  const galleryId = 'gallery-' + Math.floor(Math.random() * 10000);
  
  // Create thumbnail HTML
  const imagesHtml = images.map((img: any, index: number) => 
    createGalleryThumbnailHTML(img, index, sizeClass, enableLightbox, galleryId)
  ).join('\n');
  
  // Add lightbox modal if enabled
  let lightboxHtml = '';
  if (enableLightbox && images.length > 0) {
    lightboxHtml = createLightboxModalHTML(images, galleryId);
  }

  return `<!-- @component: ImageGallery -->
<section${id}${className}${dataAttributes}>
  <div class="container">
    <h2 class="section-title">${title}</h2>
    <div class="gallery-grid" id="${galleryId}">
      ${imagesHtml}
    </div>
  </div>
</section>
${lightboxHtml}\n`;
}

/**
 * Creates HTML for a single accordion item
 * @param item Accordion item data
 * @param index Item index
 * @param itemId Unique ID for this item
 * @param accordionId Parent accordion ID
 * @param allowMultiple Whether multiple items can be open simultaneously
 * @returns HTML for accordion item
 */
export function createAccordionItemHTML(
  item: any, 
  index: number, 
  itemId: string, 
  accordionId: string, 
  allowMultiple: boolean
): string {
  return `
        <div class="accordion-item">
          <h3 class="accordion-header">
            <button class="accordion-button" 
                    type="button" 
                    data-target="${itemId}" 
                    aria-expanded="${index === 0 ? 'true' : 'false'}" 
                    aria-controls="${itemId}">
              ${item.title || 'Accordion Item'}
            </button>
          </h3>
          <div id="${itemId}" 
               class="accordion-collapse ${index === 0 ? 'show' : 'hide'}" 
               ${!allowMultiple ? `data-parent="${accordionId}"` : ''}>
            <div class="accordion-body">
              ${item.content || 'Content goes here'}
            </div>
          </div>
        </div>`;
}

/**
 * Creates HTML for accordion component
 * @param title Accordion title
 * @param allowMultiple Whether multiple items can be open simultaneously
 * @param items Array of accordion items with title and content
 * @param attributes Optional ID, class and data attributes
 * @returns HTML for accordion component
 */
export function createAccordionHTML(
  title: string,
  allowMultiple: boolean,
  items: any[],
  attributes: ComponentAttributes = {}
): string {
  // Build HTML attributes
  const id = attributes.id ? ` id="${attributes.id}"` : '';
  const className = attributes.className ? ` class="${attributes.className}"` : ' class="accordion-section"';
  const dataAttributes = attributes.dataAttributes ? ` ${attributes.dataAttributes}` : '';
  
  // Generate a unique ID for this accordion
  const accordionId = 'accordion-' + Math.floor(Math.random() * 10000);
  
  // Generate accordion items
  const itemsHtml = items.map((item: any, index: number) => {
    const itemId = `${accordionId}-collapse-${index}`;
    return createAccordionItemHTML(item, index, itemId, accordionId, allowMultiple);
  }).join('\n');

  return `<!-- @component: Accordion -->
<section${id}${className}${dataAttributes}>
  <div class="container">
    <h2 class="section-title">${title}</h2>
    <div class="accordion" id="${accordionId}" ${allowMultiple ? 'data-allow-multiple="true"' : ''}>
      ${itemsHtml}
    </div>
  </div>
</section>\n`;
}
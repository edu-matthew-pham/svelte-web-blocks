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
    <div class="${layout === 'grid' ? `col-md-${12/Math.min(columns, 12)}` : 'col-12 mb-3'}">
      <div class="card h-100 border-0 shadow-sm">
        <div class="card-body p-4 text-center">
          <div class="display-5 mb-3">${item.icon || '🔍'}</div>
          <h5 class="card-title mb-3">${item.title || 'Title'}</h5>
          <p class="card-text text-body-secondary">${item.description || 'Description'}</p>
        </div>
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
      <div class="carousel-item ${i === 0 ? 'active' : ''}">
        <div class="row">
          ${slideItems.map((item) => `
            <div class="col-${12/Math.min(itemsPerSlide, 12)}">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-body p-4 text-center">
                  <div class="display-5 mb-3">${item.icon || '🔍'}</div>
                  <h5 class="card-title mb-3">${item.title || 'Title'}</h5>
                  <p class="card-text text-body-secondary">${item.description || 'Description'}</p>
                </div>
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
    <div class="carousel-indicators position-static mt-3 mb-0">
      ${Array.from({length: slideCount}, (_, i) => `
        <button type="button" data-bs-target="#${componentId}" data-bs-slide-to="${i}" 
          ${i === 0 ? 'class="active" aria-current="true"' : ''} 
          aria-label="Slide ${i+1}"></button>
      `).join('')}
    </div>
  `;
}

/**
 * Creates HTML for the document structure
 * @param title Document title
 * @param theme Theme name (Bootstrap standard or Bootswatch theme)
 * @param content Inner page content
 * @param scripts JavaScript code
 * @param attributes Optional ID, class and data attributes
 * @returns Complete HTML document
 */
export function createDocumentHTML(
  title: string,
  theme: string,
  content: string, 
  scripts: string,
  attributes: { id?: string, className?: string, dataAttributes?: string } = {}
): string {
  // Check if using Bootstrap standard theme (light/dark) or Bootswatch theme
  const isBootstrapTheme = theme === 'light' || theme === 'dark';
  const cssLink = isBootstrapTheme 
    ? `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">`
    : `<link href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${theme}/bootstrap.min.css" rel="stylesheet">`;

  // Build HTML class attribute from both the theme class and any user-provided classes
  const bodyClass = attributes.className ? ` class="${attributes.className}"` : '';
  
  // Build HTML id and data attributes
  const bodyId = attributes.id ? ` id="${attributes.id}"` : '';
  const bodyData = attributes.dataAttributes ? ` ${attributes.dataAttributes}` : '';
  
  const htmlString = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!-- Bootstrap CSS -->
  ${cssLink}
  ${isBootstrapTheme ? `<meta name="theme" content="${theme}">` : ''}
  <script>
    ${scripts}
  </script>
</head>
<body${bodyId}${bodyClass}${bodyData} ${isBootstrapTheme ? `data-bs-theme="${theme}"` : ''}>
  ${content}
  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

  // Format the final HTML
  return html(htmlString, {
    indent_size: 2,
    indent_inner_html: true,
    wrap_line_length: 0,
    preserve_newlines: true,
    max_preserve_newlines: 1
  });
}

/**
 * Creates HTML for the header component
 * @param logoText Text for the logo/brand
 * @param includeSignup Whether to include signup button
 * @param navigationItems HTML string for navigation items
 * @returns HTML for header component
 */
export function createHeaderHTML(
  logoText: string,
  includeSignup: boolean,
  navigationItems: string
): string {
  return `<!-- @component: Header
  logoText: "${logoText}"
  includeSignup: "${includeSignup}"
-->
<header class="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top">
  <div class="container">
    <a class="navbar-brand fw-bold" href="/">${logoText}</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        ${navigationItems}
      </ul>
      ${includeSignup ? `<div class="d-flex">
        <a href="/signup" class="btn btn-outline-primary ms-2">Sign Up</a>
      </div>` : ''}
    </div>
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
 * @returns HTML for hero component
 */
export function createHeroHTML(
  headline: string,
  subheadline: string,
  buttonText: string,
  buttonUrl: string,
  hasImage: boolean,
  imageUrl: string = ''
): string {
  return `<!-- @component: Hero -->
<section class="py-5 bg-body-secondary border-bottom">
  <div class="container py-5">
    <div class="row align-items-center g-5">
      <div class="col-lg-${hasImage ? '6' : '8 mx-auto text-center'}">
        <div class="p-4 p-lg-5 bg-body-tertiary rounded-3 shadow-sm">
          <h1 class="fw-bold display-5 mb-3">${headline}</h1>
          <p class="lead mb-4 text-body-secondary">${subheadline}</p>
          <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <a href="${buttonUrl}" class="btn btn-primary btn-lg px-4 gap-3">${buttonText}</a>
            <a href="#features" class="btn btn-outline-secondary btn-lg px-4">Learn more</a>
          </div>
        </div>
      </div>
      ${hasImage ? `<div class="col-lg-6">
        <div class="ratio ratio-16x9 overflow-hidden rounded shadow-lg">
          <img src="${imageUrl}" alt="Hero image" class="img-fluid object-fit-cover">
        </div>
      </div>` : ''}
    </div>
  </div>
</section>`;
}

/**
 * Creates HTML for a navigation item
 * @param text Text for the navigation link
 * @param url URL for the navigation link
 * @returns HTML for navigation item
 */
export function createNavItemHTML(text: string, url: string): string {
  return `<!-- @item: NavItem
  text: "${text}"
  url: "${url}"
-->
<li class="nav-item">
  <a class="nav-link px-lg-3" href="${url}">${text}</a>
</li>\n`;
}

/**
 * Creates HTML for feature cards section
 * @param title Section title
 * @param backgroundColor Background color value
 * @param features HTML string for feature cards
 * @returns HTML for feature cards section
 */
export function createFeatureCardsHTML(title: string, backgroundColor: string, features: string): string {
  return `<!-- @component: FeatureCards -->
<section class="py-5" style="background-color: ${backgroundColor};">
  <div class="container">
    <h2 class="text-center mb-5">${title}</h2>
    <div class="row g-4">
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
 * @param columns Number of columns in the grid (1-6)
 * @returns HTML for feature card
 */
export function createFeatureCardHTML(icon: string, title: string, description: string, columns: number): string {
  // Determine the appropriate column class based on number of columns
  let columnClass;
  switch(columns) {
    case 1: columnClass = 'col-12'; break;
    case 2: columnClass = 'col-md-6'; break;
    case 3: columnClass = 'col-md-4'; break;
    case 4: columnClass = 'col-md-3'; break;
    case 5: columnClass = 'col-md-5th'; break; // 1/5 width
    case 6: columnClass = 'col-md-2'; break;   // 1/6 width
    default: columnClass = 'col-md-4';
  }

  return `<!-- @item: FeatureCard -->
<div class="${columnClass}">
  <div class="card h-100 border-0 shadow-sm">
    <div class="card-body p-4 text-center">
      <div class="display-5 mb-3">${icon}</div>
      <h5 class="card-title mb-3">${title}</h5>
      <p class="card-text text-body-secondary">${description}</p>
    </div>
  </div>
</div>\n`;
}

/**
 * Creates HTML for content section
 * @param headline Section headline
 * @param contentBlocks HTML string for content blocks
 * @returns HTML for content section
 */
export function createContentSectionHTML(headline: string, contentBlocks: string): string {
  return `<!-- @component: ContentSection -->
<section class="py-5">
  <div class="container">
    <h2 class="mb-4">${headline}</h2>
    <div class="row g-4">
      ${contentBlocks}
    </div>
  </div>
</section>\n`;
}

/**
 * Creates HTML for a content block
 * @param htmlContent HTML content (converted from markdown)
 * @param columns Number of columns (1-3)
 * @returns HTML for content block
 */
export function createContentBlockHTML(htmlContent: string, columns: number): string {
  // Determine the appropriate column class based on number of columns
  let columnClass;
  switch(columns) {
    case 1: columnClass = 'col-12'; break;
    case 2: columnClass = 'col-md-6'; break;
    case 3: columnClass = 'col-md-4'; break;
    default: columnClass = 'col-12';
  }

  return `<!-- @item: ContentBlock -->
<div class="${columnClass}">
  <div class="card h-100 border-0">
    <div class="card-body markdown-content">
      ${htmlContent}
    </div>
  </div>
</div>\n`;
}

/**
 * Creates HTML for a basic form
 * @param title Form title
 * @param submitText Submit button text
 * @param formFields HTML string for form fields
 * @returns HTML for form component
 */
export function createFormHTML(title: string, submitText: string, formFields: string): string {
  return `<!-- @component: Form -->
<section class="py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4 p-md-5">
            <h2 class="text-center mb-4">${title}</h2>
            <form>
              ${formFields}
              <div class="d-grid mt-4">
                <button type="submit" class="btn btn-primary">${submitText}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>\n`;
}

/**
 * Creates HTML for a checkbox form field
 * @param id Field ID
 * @param label Field label
 * @param required Whether field is required
 * @returns HTML for checkbox form field
 */
export function createCheckboxFieldHTML(id: string, label: string, required: boolean): string {
  return `<!-- @item: FormField -->
<div class="mb-3 form-check">
  <input type="checkbox" class="form-check-input" id="${id}" ${required ? 'required' : ''}>
  <label class="form-check-label" for="${id}">${label}</label>
</div>\n`;
}

/**
 * Creates HTML for a radio option
 * @param id Base field ID
 * @param option Option text
 * @param index Option index
 * @param required Whether field is required
 * @returns HTML for radio option
 */
export function createRadioOptionHTML(id: string, option: string, index: number, required: boolean): string {
  const optId = `${id}-${index}`;
  return `<div class="form-check">
  <input class="form-check-input" type="radio" name="${id}" id="${optId}" ${index === 0 && required ? 'required' : ''} ${index === 0 ? 'checked' : ''}>
  <label class="form-check-label" for="${optId}">${option}</label>
</div>`;
}

/**
 * Creates HTML for a select form field
 * @param id Field ID
 * @param options Array of options
 * @param required Whether field is required
 * @returns HTML for select input
 */
export function createSelectFieldHTML(id: string, options: string[], required: boolean): string {
  const optionsHtml = options.map((option: string) => 
    `<option value="${option.toLowerCase().replace(/\s+/g, '-')}">${option}</option>`
  ).join('\n    ');
  
  return `<select class="form-select" id="${id}" ${required ? 'required' : ''}>
    <option value="" selected disabled>Please select...</option>
    ${optionsHtml}
  </select>`;
}

/**
 * Creates HTML for a standard form field
 * @param id Field ID
 * @param label Field label
 * @param inputHtml HTML for the input element
 * @param required Whether field is required
 * @returns HTML for standard form field
 */
export function createStandardFieldHTML(id: string, label: string, inputHtml: string, required: boolean): string {
  return `<!-- @item: FormField -->
<div class="mb-3">
  <label for="${id}" class="form-label">${label}${required ? ' *' : ''}</label>
  ${inputHtml}
</div>\n`;
}

/**
 * Creates HTML for a radio group form field
 * @param label Field label
 * @param inputHtml HTML for the radio options
 * @param required Whether field is required
 * @returns HTML for radio group form field
 */
export function createRadioGroupHTML(label: string, inputHtml: string, required: boolean): string {
  return `<!-- @item: FormField -->
<div class="mb-3">
  <label class="form-label d-block">${label}${required ? ' *' : ''}</label>
  ${inputHtml}
</div>\n`;
}

/**
 * Creates HTML for footer component
 * @param copyright Copyright text
 * @param links HTML string for footer links
 * @returns HTML for footer component
 */
export function createFooterHTML(copyright: string, links: string): string {
  return `<!-- @component: Footer -->
<footer class="py-5 bg-body-tertiary">
  <div class="container">
    <div class="row gy-4 justify-content-between">
      <div class="col-lg-4">
        <p class="small mb-0">${copyright}</p>
      </div>
      <div class="col-lg-8">
        <div class="d-flex flex-wrap justify-content-end gap-3">
          ${links}
        </div>
      </div>
    </div>
  </div>
</footer>\n`;
}

/**
 * Creates HTML for a footer link
 * @param text Link text
 * @param url Link URL
 * @returns HTML for footer link
 */
export function createFooterLinkHTML(text: string, url: string): string {
  return `<!-- @item: FooterLink -->
<a href="${url}" class="text-decoration-none" style="color: inherit;">${text}</a>\n`;
}

/**
 * Creates HTML for dynamic cards component
 * @param title Section title
 * @param wrapperHtml Wrapper HTML containing cards
 * @returns HTML for dynamic cards section
 */
export function createDynamicCardsHTML(title: string, wrapperHtml: string): string {
  return `<!-- @component: DynamicCards -->
<section class="py-5">
  <div class="container">
    <h2 class="text-center mb-5">${title}</h2>
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
    <div class="position-relative">
      <div id="${componentId}" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          ${slides}
        </div>
        
        ${slideCount > 1 ? `
          <button class="carousel-control-prev" type="button" data-bs-target="#${componentId}" data-bs-slide="prev" 
              style="width: 40px; left: -50px; opacity: 1; background: transparent;">
            <span class="carousel-control-prev-icon bg-dark bg-opacity-25 rounded-circle p-3" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#${componentId}" data-bs-slide="next"
              style="width: 40px; right: -50px; opacity: 1; background: transparent;">
            <span class="carousel-control-next-icon bg-dark bg-opacity-25 rounded-circle p-3" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
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
  return `<div class="row g-4">
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
        <div class="${sizeClass} mb-4">
          <div class="card border-0 shadow-sm h-100">
            <a href="${img.url}" class="${enableLightbox ? 'gallery-item' : ''}" ${enableLightbox ? `data-bs-toggle="modal" data-bs-target="#${galleryId}-modal" data-bs-slide-to="${index}"` : 'target="_blank"'}>
              <img src="${img.url}" alt="${img.alt || ''}" class="card-img-top img-fluid" style="aspect-ratio: 4/3; object-fit: cover;">
            </a>
            ${img.caption ? `
            <div class="card-body">
              <p class="card-text">${img.caption}</p>
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
        <div class="modal fade" id="${galleryId}-modal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content bg-transparent border-0">
              <div class="modal-body p-0">
                <div id="${galleryId}-carousel" class="carousel slide">
                  <div class="carousel-inner">
                    ${images.map((img: any, index: number) => `
                      <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${img.url}" class="d-block w-100 rounded" alt="${img.alt || ''}">
                        ${img.caption ? `<div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2"><p>${img.caption}</p></div>` : ''}
                      </div>
                    `).join('\n')}
                  </div>
                  <button class="carousel-control-prev" type="button" data-bs-target="#${galleryId}-carousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#${galleryId}-carousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                  </button>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
            </div>
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
 * @returns HTML for image gallery component
 */
export function createImageGalleryHTML(
  title: string,
  thumbnailSize: string,
  enableLightbox: boolean,
  images: any[]
): string {
  // Determine thumbnail size class
  let sizeClass;
  switch(thumbnailSize) {
    case 'small': sizeClass = 'col-6 col-md-3'; break;
    case 'large': sizeClass = 'col-12 col-md-6'; break;
    default: sizeClass = 'col-6 col-md-4'; // medium
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
<section class="py-5">
  <div class="container">
    <h2 class="text-center mb-5">${title}</h2>
    <div class="row" id="${galleryId}">
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
          <h2 class="accordion-header">
            <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#${itemId}" 
                    aria-expanded="${index === 0 ? 'true' : 'false'}" 
                    aria-controls="${itemId}">
              ${item.title || 'Accordion Item'}
            </button>
          </h2>
          <div id="${itemId}" 
               class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
               ${!allowMultiple ? `data-bs-parent="#${accordionId}"` : ''}>
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
 * @returns HTML for accordion component
 */
export function createAccordionHTML(
  title: string,
  allowMultiple: boolean,
  items: any[]
): string {
  // Generate a unique ID for this accordion
  const accordionId = 'accordion-' + Math.floor(Math.random() * 10000);
  
  // Generate accordion items
  const itemsHtml = items.map((item: any, index: number) => {
    const itemId = `${accordionId}-collapse-${index}`;
    return createAccordionItemHTML(item, index, itemId, accordionId, allowMultiple);
  }).join('\n');

  return `<!-- @component: Accordion -->
<section class="py-5">
  <div class="container">
    <h2 class="text-center mb-5">${title}</h2>
    <div class="accordion" id="${accordionId}">
      ${itemsHtml}
    </div>
  </div>
</section>\n`;
}

/**
 * Creates HTML for a form field based on field type
 * @param id Field ID
 * @param label Field label
 * @param type Field type
 * @param required Whether field is required
 * @param options Options for select or radio fields
 * @returns HTML for the form field
 */
export function createFormFieldHTML(id: string, label: string, type: string, required: boolean, options: string[] = []): string {
  switch(type) {
    case 'text':
    case 'email':
    case 'number':
    case 'tel':
    case 'date':
    case 'time':
      const inputHtml = `<input type="${type}" class="form-control" id="${id}" ${required ? 'required' : ''}>`;
      return createStandardFieldHTML(id, label, inputHtml, required);
      
    case 'textarea':
      const textareaHtml = `<textarea class="form-control" id="${id}" rows="3" ${required ? 'required' : ''}></textarea>`;
      return createStandardFieldHTML(id, label, textareaHtml, required);
      
    case 'checkbox':
      return createCheckboxFieldHTML(id, label, required);
      
    case 'radio':
      const radioHtml = options.map((option, i) => 
        createRadioOptionHTML(id, option, i, required)
      ).join('\n');
      return createRadioGroupHTML(label, radioHtml, required);
      
    case 'select':
      const selectHtml = createSelectFieldHTML(id, options, required);
      return createStandardFieldHTML(id, label, selectHtml, required);
    
    default:
      return '';
  }
} 
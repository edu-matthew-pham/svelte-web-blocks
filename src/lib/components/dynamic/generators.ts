import { createCardsHTML, createCarouselSlidesHTML, createCarouselIndicatorsHTML, 
         createCarouselWrapperHTML, createGridWrapperHTML, createDynamicCardsHTML,
         createImageGalleryHTML, createAccordionHTML } from '$lib/blocks/htmlTemplates.js';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Create generators for dynamic components
export const dynamicGenerators = {
  // Dynamic cards generator
  web_dynamic_cards: {
    html: function(block: Blockly.Block): string {
      const title = block.getFieldValue('TITLE');
      const layout = block.getFieldValue('LAYOUT');
      const columns = parseInt(block.getFieldValue('COLUMNS'));
      const dataJson = block.getFieldValue('DATA');
      
      // Extract ID and CLASS values
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      // Create attributes object
      const attributes = {
        id: id,
        className: className
      };
      
      // Parse the JSON data safely
      let dataItems = [];
      try {
        dataItems = JSON.parse(dataJson);
      } catch (e) {
        console.error('Error parsing JSON data for dynamic cards:', e);
      }
      
      // Create unique ID for this component
      const componentId = 'dynamic-' + Math.floor(Math.random() * 100000);
      
      // Create appropriate wrapper based on layout
      let wrapperHtml;
      if (layout === 'carousel') {
        // Group items into slides based on columns setting
        const itemsPerSlide = columns;
        const slides = createCarouselSlidesHTML(dataItems, itemsPerSlide);
        
        // Calculate number of slides
        const slideCount = Math.ceil(dataItems.length / itemsPerSlide);
        
        // Create indicator dots
        const indicators = createCarouselIndicatorsHTML(componentId, slideCount);
        
        wrapperHtml = createCarouselWrapperHTML(componentId, slides, slideCount, indicators);
      } else {
        // Use the template function for regular cards
        const cardsHtml = createCardsHTML(dataItems, layout, columns);
        wrapperHtml = createGridWrapperHTML(cardsHtml);
      }
      
      return createDynamicCardsHTML(title, wrapperHtml, attributes);
    },
    
    highLevel: function(block: Blockly.Block): any {
      let dataItems = [];
      try {
        dataItems = JSON.parse(block.getFieldValue('DATA'));
      } catch (e) {
        console.error('Error parsing JSON data for dynamic cards:', e);
      }
      
      return {
        type: "dynamic_cards",
        properties: {
          title: block.getFieldValue('TITLE'),
          layout: block.getFieldValue('LAYOUT'),
          columns: block.getFieldValue('COLUMNS'),
          data: dataItems,
          id: block.getFieldValue('ID'),
          className: block.getFieldValue('CLASS')
        }
      };
    }
  },
  
  // Image gallery generator
  web_image_gallery: {
    html: function(block: Blockly.Block): string {
      const title = block.getFieldValue('TITLE');
      const thumbnailSize = block.getFieldValue('THUMBNAIL_SIZE');
      const enableLightbox = block.getFieldValue('LIGHTBOX') === 'TRUE';
      const dataJson = block.getFieldValue('DATA');
      
      // Extract ID and CLASS values
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      // Create attributes object
      const attributes = {
        id: id,
        className: className
      };
      
      // Parse the JSON data safely
      let images = [];
      try {
        images = JSON.parse(dataJson);
      } catch (e) {
        console.error('Error parsing JSON data for image gallery:', e);
      }
      
      return createImageGalleryHTML(title, thumbnailSize, enableLightbox, images, attributes);
    },
    
    highLevel: function(block: Blockly.Block): any {
      let images = [];
      try {
        images = JSON.parse(block.getFieldValue('DATA'));
      } catch (e) {
        console.error('Error parsing JSON data for image gallery:', e);
      }
      
      return {
        type: "image_gallery",
        properties: {
          title: block.getFieldValue('TITLE'),
          thumbnailSize: block.getFieldValue('THUMBNAIL_SIZE'),
          enableLightbox: block.getFieldValue('LIGHTBOX') === 'TRUE',
          images: images,
          id: block.getFieldValue('ID'),
          className: block.getFieldValue('CLASS')
        }
      };
    }
  },
  
  // Accordion generator
  web_accordion: {
    html: function(block: Blockly.Block): string {
      const title = block.getFieldValue('TITLE');
      const allowMultiple = block.getFieldValue('ALLOW_MULTIPLE') === 'TRUE';
      const dataJson = block.getFieldValue('DATA');
      
      // Extract ID and CLASS values
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      // Create attributes object
      const attributes = {
        id: id,
        className: className
      };
      
      // Parse the JSON data safely
      let items = [];
      try {
        items = JSON.parse(dataJson);
      } catch (e) {
        console.error('Error parsing JSON data for accordion:', e);
      }
      
      return createAccordionHTML(title, allowMultiple, items, attributes);
    },
    
    highLevel: function(block: Blockly.Block): any {
      let items = [];
      try {
        items = JSON.parse(block.getFieldValue('DATA'));
      } catch (e) {
        console.error('Error parsing JSON data for accordion:', e);
      }
      
      return {
        type: "accordion",
        properties: {
          title: block.getFieldValue('TITLE'),
          allowMultiple: block.getFieldValue('ALLOW_MULTIPLE') === 'TRUE',
          items: items,
          id: block.getFieldValue('ID'),
          className: block.getFieldValue('CLASS')
        }
      };
    }
  }
}; 
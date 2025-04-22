import type { WebBlockGenerator, WebBlockGeneratorFunctions } from '../types.js';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { marked } from 'marked';
import * as HTML from './htmlTemplates.js';

// Extend the JavascriptGenerator type with our custom method
declare module 'blockly/javascript' {
  interface JavascriptGenerator {
    blockToHighLevel(block: Blockly.Block): any;
    forBlock: {
      [key: string]: {
        (block: Blockly.Block): string | [string, number] | null;
        highLevel?: (block: Blockly.Block) => any;
      };
    };
  }
}

// Add a method to the generator for high-level code generation
javascriptGenerator.blockToHighLevel = function(block: Blockly.Block) {
    const func = this.forBlock[block.type]?.highLevel;
    return func ? func(block) : null;
};

// Set options for marked
marked.setOptions({
  breaks: true
});

export const webGenerators: WebBlockGeneratorFunctions = {
  // Document generator - new wrapper component
  web_document: {
    html: function(block: Blockly.Block) {
      const title = block.getFieldValue('TITLE');
      const theme = block.getFieldValue('THEME');
      const content = javascriptGenerator.statementToCode(block, 'CONTENT');
      const scripts = javascriptGenerator.statementToCode(block, 'SCRIPTS');
      
      // Extract ID and CLASS values if they exist on the block
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      // Create attributes object
      const attributes = { id, className };
      
      return HTML.createDocumentHTML(title, theme, content, scripts, '', attributes) + '\n';
    },
    
    highLevel: function(block: Blockly.Block) {
      // Process content blocks
      const children = [];
      let contentBlock = block.getInputTargetBlock('CONTENT');
      while (contentBlock) {
        const content = javascriptGenerator.blockToHighLevel(contentBlock);
        if (content) children.push(content);
        contentBlock = contentBlock.getNextBlock();
      }
      
      // Process script blocks
      const scripts = [];
      let scriptBlock = block.getInputTargetBlock('SCRIPTS');
      while (scriptBlock) {
        const script = javascriptGenerator.blockToHighLevel(scriptBlock);
        if (script) scripts.push(script);
        scriptBlock = scriptBlock.getNextBlock();
      }
      
      return {
        type: "document",
        properties: {
          title: block.getFieldValue('TITLE'),
          theme: block.getFieldValue('THEME')
        },
        children: children,
        scripts: scripts
      };
    }
  },

  // Header generator
  web_header: {
    html: function(block: Blockly.Block) {
      const logoText = block.getFieldValue('LOGO_TEXT');
      const includeSignup = block.getFieldValue('INCLUDE_SIGNUP') === 'TRUE';
      const navigationItems = javascriptGenerator.statementToCode(block, 'LINKS');
      
      return HTML.createHeaderHTML(logoText, includeSignup, navigationItems) + '\n';
    },
    
    highLevel: function(block: Blockly.Block) {
      const logoText = block.getFieldValue('LOGO_TEXT');
      const includeSignup = block.getFieldValue('INCLUDE_SIGNUP') === 'TRUE';
      
      // Process navigation items
      const children = [];
      let navBlock = block.getInputTargetBlock('LINKS');
      while (navBlock) {
        const navItem = javascriptGenerator.blockToHighLevel(navBlock);
        if (navItem) children.push(navItem);
        navBlock = navBlock.getNextBlock();
      }
      
      return {
        type: "header",
        properties: {
          logoText,
          includeSignup
        },
        children: children
      };
    }
  },

  // Navigation item generator - updated for consistency
  web_nav_item: {
    html: function(block: Blockly.Block) {
      const text = block.getFieldValue('TEXT');
      const url = block.getFieldValue('URL');
      
      return HTML.createNavItemHTML(text, url);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: "navItem",
        properties: {
          text: block.getFieldValue('TEXT'),
          url: block.getFieldValue('URL')
        }
      };
    }
  },

  // Hero section generator - updated to match example format
  web_hero: {
    html: function(block: Blockly.Block) {
      const headline = block.getFieldValue('HEADLINE');
      const subheadline = block.getFieldValue('SUBHEADLINE');
      const buttonText = block.getFieldValue('BUTTON_TEXT');
      const buttonUrl = block.getFieldValue('BUTTON_URL');
      const hasImage = block.getFieldValue('HAS_IMAGE') === 'TRUE';
      const imageUrl = hasImage ? block.getFieldValue('IMAGE_URL') : '';
      
      return HTML.createHeroHTML(headline, subheadline, buttonText, buttonUrl, hasImage, imageUrl) + '\n';
    },
    
    highLevel: function(block: Blockly.Block) {
      const hasImage = block.getFieldValue('HAS_IMAGE') === 'TRUE';
      const imageUrl = hasImage ? block.getFieldValue('IMAGE_URL') : '';
      
      return {
        type: "hero",
        properties: {
          headline: block.getFieldValue('HEADLINE'),
          subheadline: block.getFieldValue('SUBHEADLINE'),
          buttonText: block.getFieldValue('BUTTON_TEXT'),
          buttonUrl: block.getFieldValue('BUTTON_URL'),
          hasImage: hasImage,
          imageUrl: imageUrl
        }
      };
    }
  },

  // Feature cards generator - updated for consistency
  web_feature_cards: {
    html: function(block: Blockly.Block) {
      const title = block.getFieldValue('TITLE');
      const columns = block.getFieldValue('COLUMNS');
      const backgroundColor = block.getFieldValue('BACKGROUND_COLOR');
      const features = javascriptGenerator.statementToCode(block, 'CARDS');
      
      return HTML.createFeatureCardsHTML(title, backgroundColor, features);
    },
    
    highLevel: function(block: Blockly.Block) {
      // Process feature cards
      const children = [];
      let featureBlock = block.getInputTargetBlock('CARDS');
      while (featureBlock) {
        const feature = javascriptGenerator.blockToHighLevel(featureBlock);
        if (feature) children.push(feature);
        featureBlock = featureBlock.getNextBlock();
      }
      
      return {
        type: "featureCards",
        properties: {
          title: block.getFieldValue('TITLE'),
          columns: block.getFieldValue('COLUMNS'),
          backgroundColor: block.getFieldValue('BACKGROUND_COLOR')
        },
        children: children
      };
    }
  },

  // Feature card generator - updated for consistency
  web_feature_card: {
    html: function(block: Blockly.Block) {
      const icon = block.getFieldValue('ICON');
      const title = block.getFieldValue('TITLE');
      const description = block.getFieldValue('DESCRIPTION');
      
      // Get parent block's column setting
      let columns = 3; // Default to 3 columns
      const parent = block.getSurroundParent();
      if (parent && parent.type === 'web_feature_cards') {
        columns = parseInt(parent.getFieldValue('COLUMNS'));
      }
      
      return HTML.createFeatureCardHTML(icon, title, description, columns);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: "featureCard",
        properties: {
          icon: block.getFieldValue('ICON'),
          title: block.getFieldValue('TITLE'),
          description: block.getFieldValue('DESCRIPTION')
        }
      };
    }
  },

  // Content section generator
  web_content_section: {
    html: function(block: Blockly.Block) {
      const headline = block.getFieldValue('HEADLINE');
      const columns = block.getFieldValue('COLUMNS');
      const contentBlocks = javascriptGenerator.statementToCode(block, 'CONTENT_BLOCKS');
      
      return HTML.createContentSectionHTML(headline, contentBlocks);
    },
    
    highLevel: function(block: Blockly.Block) {
      // Process content blocks
      const children = [];
      let contentBlock = block.getInputTargetBlock('CONTENT_BLOCKS');
      while (contentBlock) {
        const content = javascriptGenerator.blockToHighLevel(contentBlock);
        if (content) children.push(content);
        contentBlock = contentBlock.getNextBlock();
      }
      
      return {
        type: "contentSection",
        properties: {
          headline: block.getFieldValue('HEADLINE'),
          columns: block.getFieldValue('COLUMNS')
        },
        children: children
      };
    }
  },

  // Content block generator
  web_content_block: {
    html: function(block: Blockly.Block) {
      const markdownContent = block.getFieldValue('CONTENT');
      // Force synchronous operation with marked
      const htmlContent = marked.parse(markdownContent, { async: false }) as string;
      
      // Get parent block's column setting
      let columns = 1; // Default to 1 column
      const parent = block.getSurroundParent();
      if (parent && parent.type === 'web_content_section') {
        columns = parseInt(parent.getFieldValue('COLUMNS'));
      }
      
      return HTML.createContentBlockHTML(htmlContent, columns);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: "contentBlock",
        properties: {
          content: block.getFieldValue('CONTENT'),
          isMarkdown: true
        }
      };
    }
  },

  // Form generator
  web_basic_form: {
    html: function(block: Blockly.Block) {
      const title = block.getFieldValue('TITLE');
      const submitText = block.getFieldValue('SUBMIT_TEXT');
      const formFields = javascriptGenerator.statementToCode(block, 'FIELDS');
      
      return HTML.createFormHTML(title, submitText, formFields);
    },
    
    highLevel: function(block: Blockly.Block) {
      // Process form fields
      const children = [];
      let fieldBlock = block.getInputTargetBlock('FIELDS');
      while (fieldBlock) {
        const field = javascriptGenerator.blockToHighLevel(fieldBlock);
        if (field) children.push(field);
        fieldBlock = fieldBlock.getNextBlock();
      }
      
      return {
        type: "form",
        properties: {
          title: block.getFieldValue('TITLE'),
          submitText: block.getFieldValue('SUBMIT_TEXT')
        },
        children: children
      };
    }
  },

  // Form field generator
  web_form_field: {
    html: function(block: Blockly.Block) {
      const label = block.getFieldValue('LABEL');
      const type = block.getFieldValue('TYPE');
      const required = block.getFieldValue('REQUIRED') === 'TRUE';
      const options = block.getFieldValue('OPTIONS');
      
      // Generate a sanitized ID from the label
      const id = `field-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      
      // For select or radio fields, process the options
      let parsedOptions = [];
      if (type === 'select' || type === 'radio') {
        parsedOptions = options.split(',').map((opt: string) => opt.trim());
      }
      
      return '';
    },
    
    highLevel: function(block: Blockly.Block) {
      const type = block.getFieldValue('TYPE');
      const required = block.getFieldValue('REQUIRED') === 'TRUE';
      const options = type === 'select' || type === 'radio' ? 
        block.getFieldValue('OPTIONS').split(',').map((opt: string) => opt.trim()) : 
        [];
      
      return {
        type: "formField",
        properties: {
          label: block.getFieldValue('LABEL'),
          fieldType: type,
          required: required,
          options: options
        }
      };
    }
  },

  // Footer generator
  web_footer: {
    html: function(block: Blockly.Block) {
      const copyright = block.getFieldValue('COPYRIGHT');
      const links = javascriptGenerator.statementToCode(block, 'LINKS');
      
      return HTML.createFooterHTML(copyright, links);
    },
    
    highLevel: function(block: Blockly.Block) {
      // Process footer links
      const children = [];
      let linkBlock = block.getInputTargetBlock('LINKS');
      while (linkBlock) {
        const link = javascriptGenerator.blockToHighLevel(linkBlock);
        if (link) children.push(link);
        linkBlock = linkBlock.getNextBlock();
      }
      
      return {
        type: "footer",
        properties: {
          copyright: block.getFieldValue('COPYRIGHT')
        },
        children: children
      };
    }
  },

  // Footer link generator
  web_footer_link: {
    html: function(block: Blockly.Block) {
      const text = block.getFieldValue('TEXT');
      const url = block.getFieldValue('URL');
      
      return HTML.createFooterLinkHTML(text, url);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: "footerLink",
        properties: {
          text: block.getFieldValue('TEXT'),
          url: block.getFieldValue('URL')
        }
      };
    }
  },

  // Dynamic cards generator
  web_dynamic_cards: {
    html: function(block: Blockly.Block) {
      const title = block.getFieldValue('TITLE');
      const layout = block.getFieldValue('LAYOUT');
      const columns = parseInt(block.getFieldValue('COLUMNS'));
      const dataJson = block.getFieldValue('DATA');
      
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
        const slides = HTML.createCarouselSlidesHTML(dataItems, itemsPerSlide);
        
        // Calculate number of slides
        const slideCount = Math.ceil(dataItems.length / itemsPerSlide);
        
        // Create indicator dots
        const indicators = HTML.createCarouselIndicatorsHTML(componentId, slideCount);
        
        wrapperHtml = HTML.createCarouselWrapperHTML(componentId, slides, slideCount, indicators);
      } else {
        // Use the template function for regular cards
        const cardsHtml = HTML.createCardsHTML(dataItems, layout, columns);
        wrapperHtml = HTML.createGridWrapperHTML(cardsHtml);
      }
      
      return HTML.createDynamicCardsHTML(title, wrapperHtml);
    },
    
    highLevel: function(block: Blockly.Block) {
      let dataItems = [];
      try {
        dataItems = JSON.parse(block.getFieldValue('DATA'));
      } catch (e) {
        console.error('Error parsing JSON data for dynamic cards:', e);
      }
      
      return {
        type: "dynamicCards",
        properties: {
          title: block.getFieldValue('TITLE'),
          layout: block.getFieldValue('LAYOUT'),
          columns: block.getFieldValue('COLUMNS'),
          data: dataItems
        }
      };
    }
  },
  
  // Image gallery generator
  web_image_gallery: {
    html: function(block: Blockly.Block) {
      const title = block.getFieldValue('TITLE');
      const thumbnailSize = block.getFieldValue('THUMBNAIL_SIZE');
      const enableLightbox = block.getFieldValue('LIGHTBOX') === 'TRUE';
      const dataJson = block.getFieldValue('DATA');
      
      // Parse the JSON data safely
      let images = [];
      try {
        images = JSON.parse(dataJson);
      } catch (e) {
        console.error('Error parsing JSON data for image gallery:', e);
      }
      
      return HTML.createImageGalleryHTML(title, thumbnailSize, enableLightbox, images);
    },
    
    highLevel: function(block: Blockly.Block) {
      let images = [];
      try {
        images = JSON.parse(block.getFieldValue('DATA'));
      } catch (e) {
        console.error('Error parsing JSON data for image gallery:', e);
      }
      
      return {
        type: "imageGallery",
        properties: {
          title: block.getFieldValue('TITLE'),
          thumbnailSize: block.getFieldValue('THUMBNAIL_SIZE'),
          enableLightbox: block.getFieldValue('LIGHTBOX') === 'TRUE',
          images: images
        }
      };
    }
  },
  
  // Accordion generator
  web_accordion: {
    html: function(block: Blockly.Block) {
      const title = block.getFieldValue('TITLE');
      const allowMultiple = block.getFieldValue('ALLOW_MULTIPLE') === 'TRUE';
      const dataJson = block.getFieldValue('DATA');
      
      // Parse the JSON data safely
      let items = [];
      try {
        items = JSON.parse(dataJson);
      } catch (e) {
        console.error('Error parsing JSON data for accordion:', e);
      }
      
      return HTML.createAccordionHTML(title, allowMultiple, items);
    },
    
    highLevel: function(block: Blockly.Block) {
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
          items: items
        }
      };
    }
  }
};

// Register HTML generators with Blockly for backward compatibility
Object.keys(webGenerators).forEach(key => {
  javascriptGenerator.forBlock[key] = webGenerators[key].html;
});
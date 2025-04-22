import { createGenerator } from '$lib/utils/generator-factory.js';
import { createHeroHTML } from '$lib/blocks/htmlTemplates.js';

// Create generators for hero component
export const heroGenerators = {
  web_hero: createGenerator({
    propertyMappings: [
      { componentProp: 'headline', blockField: 'HEADLINE' },
      { componentProp: 'subheadline', blockField: 'SUBHEADLINE' },
      { componentProp: 'buttonText', blockField: 'BUTTON_TEXT' },
      { componentProp: 'buttonUrl', blockField: 'BUTTON_URL' },
      { 
        componentProp: 'hasImage', 
        blockField: 'HAS_IMAGE',
        transform: (value: string) => value === 'TRUE' 
      },
      { componentProp: 'imageUrl', blockField: 'IMAGE_URL' }
    ],
    
    // Custom HTML renderer that uses the existing template
    htmlRenderer: (props, childrenHtml, attributes) => {
      const { headline, subheadline, buttonText, buttonUrl, hasImage, imageUrl } = props;
      
      return createHeroHTML(
        headline,
        subheadline,
        buttonText,
        buttonUrl,
        hasImage,
        imageUrl,
        attributes
      );
    }
  })
}; 
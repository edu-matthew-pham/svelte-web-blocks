import { createGenerator } from '$lib/utils/generator-factory.js';
import { createHeroHTML } from '$lib/blocks/htmlTemplates.js';

// Create generators for hero component
export const heroGenerators = {
  web_hero: createGenerator({
    propertyMappings: [
      { componentProp: 'headline' },
      { componentProp: 'subheadline' },
      { componentProp: 'buttonText' },
      { componentProp: 'buttonUrl' },
      { 
        componentProp: 'hasImage', 
        transform: (value: string) => value === 'TRUE' 
      },
      { componentProp: 'imageUrl' }
    ],
    
    // Custom HTML renderer that uses the existing template
    htmlRenderer: (props, childrenHtml) => {
      const { headline, subheadline, buttonText, buttonUrl, hasImage, imageUrl } = props;
      
      return createHeroHTML(
        headline,
        subheadline,
        buttonText,
        buttonUrl,
        hasImage,
        imageUrl
      );
    }
  })
}; 
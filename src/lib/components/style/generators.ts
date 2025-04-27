import { createGenerator } from '$lib/utils/generator-factory.js';
import * as CSS from '$lib/blocks/cssTemplates.js';

// Create CSS style generators using the factory
export const styleGenerators = {
  // CSS Selector Block
  css_selector: createGenerator({
    propertyMappings: [
      { componentProp: 'selectorType', blockField: 'SELECTOR_TYPE' },
      { componentProp: 'selector' },
      { componentProp: 'id' },
      { componentProp: 'class', blockField: 'CLASS' },
      { componentProp: 'pseudo' }
    ],
    childInputs: [
      { inputName: 'DECLARATIONS' }
    ],
    htmlRenderer: (props, children, attributes) => {
      // Add defensive checks for all properties
      const selectorType = props.selectorType || 'element';
      const selector = props.selector || '';
      const id = props.id || '';
      const className = props.class || '';
      const pseudo = props.pseudo || '';
      const declarations = children.declarations || '';
      
      // Optional: Log values for debugging
      //console.log('CSS Selector values:', { selectorType, selector, id, className, pseudo });
      
      return CSS.createCssSelector(selectorType, selector, id, className, pseudo, declarations);
    }
  }),
  
  // Size Block (width/height)
  css_size: createGenerator({
    propertyMappings: [
      { componentProp: 'property' },
      { componentProp: 'value' },
      { componentProp: 'unit' }
    ],
    htmlRenderer: (props, children, attributes) => 
      CSS.createCssSize(props.property, props.value, props.unit)
  }),
  
  // Position Block
  css_position: createGenerator({
    propertyMappings: [
      { componentProp: 'property' },
      { componentProp: 'value' },
      { componentProp: 'top', blockField: 'TOP' },
      { componentProp: 'right', blockField: 'RIGHT' },
      { componentProp: 'bottom', blockField: 'BOTTOM' },
      { componentProp: 'left', blockField: 'LEFT' },
      { componentProp: 'zIndex', blockField: 'ZINDEX' },
      { componentProp: 'unit' }
    ],
    htmlRenderer: (props, children, attributes) => 
      CSS.createCssPosition(props.property, props.value, props.top, props.right, props.bottom, props.left, props.zIndex, props.unit)
  }),
  
  // Spacing Block
  css_spacing: createGenerator({
    propertyMappings: [
      { componentProp: 'property' },
      { componentProp: 'top', blockField: 'TOP' },
      { componentProp: 'right', blockField: 'RIGHT' },
      { componentProp: 'bottom', blockField: 'BOTTOM' },
      { componentProp: 'left', blockField: 'LEFT' },
      { componentProp: 'unit' }
    ],
    htmlRenderer: (props, children, attributes) => 
      CSS.createCssSpacing(props.property, props.top, props.right, props.bottom, props.left, props.unit)
  }),
  
  // Flexbox Block
  css_flexbox: createGenerator({
    propertyMappings: [
      { componentProp: 'direction' },
      { componentProp: 'justify' },
      { componentProp: 'alignItems', blockField: 'ALIGN_ITEMS' },
      { componentProp: 'wrap' },
      { componentProp: 'gap' },
      { componentProp: 'gapUnit', blockField: 'GAP_UNIT' }
    ],
    htmlRenderer: (props, children, attributes) => 
      CSS.createCssFlexbox(props.direction, props.justify, props.alignItems, props.wrap, props.gap, props.gapUnit)
  }),
  
  // Typography Block
  css_typography: createGenerator({
    propertyMappings: [
      { componentProp: 'fontSize', blockField: 'FONT_SIZE' },
      { componentProp: 'fontSizeUnit', blockField: 'FONT_SIZE_UNIT' },
      { componentProp: 'fontWeight', blockField: 'FONT_WEIGHT' },
      { componentProp: 'color' },
      { componentProp: 'textAlign', blockField: 'TEXT_ALIGN' },
      { componentProp: 'lineHeight', blockField: 'LINE_HEIGHT' }
    ],
    htmlRenderer: (props, children, attributes) => 
      CSS.createCssTypography(props.fontSize, props.fontSizeUnit, props.fontWeight, props.color, props.textAlign, props.lineHeight)
  }),
  
  // Border Block
  css_border: createGenerator({
    propertyMappings: [
      { componentProp: 'width', blockField: 'WIDTH' },
      { componentProp: 'unit' },
      { componentProp: 'style' },
      { componentProp: 'color' },
      { componentProp: 'radius' },
      { componentProp: 'radiusUnit', blockField: 'RADIUS_UNIT' }
    ],
    htmlRenderer: (props, children, attributes) => 
      CSS.createCssBorder(props.width, props.unit, props.style, props.color, props.radius, props.radiusUnit)
  }),
  
  // Background Block
  css_background: createGenerator({
    propertyMappings: [
      { componentProp: 'color' },
      { componentProp: 'image' },
      { componentProp: 'size' },
      { componentProp: 'repeat' }
    ],
    htmlRenderer: (props, children, attributes) => 
      CSS.createCssBackground(props.color, props.image, props.size, props.repeat)
  }),
  
  // Effects Block
  css_effects: createGenerator({
    propertyMappings: [
      { componentProp: 'opacity' },
      { componentProp: 'transform' },
      { componentProp: 'transformValue', blockField: 'TRANSFORM_VALUE' },
      { componentProp: 'transformUnit', blockField: 'TRANSFORM_UNIT' },
      { componentProp: 'transition' },
      { componentProp: 'duration' }
    ],
    htmlRenderer: (props, children, attributes) => 
      CSS.createCssEffects(props.opacity, props.transform, props.transformValue, props.transformUnit, props.transition, props.duration)
  }),
  
  // Custom Property Block
  css_custom: createGenerator({
    propertyMappings: [
      { componentProp: 'property' },
      { componentProp: 'value' },
      { componentProp: 'unit' }
    ],
    htmlRenderer: (props, children, attributes) => 
      CSS.createCssCustomProperty(props.property, props.value, props.unit)
  })
};

/**
 * CSS Templates - Utility functions for generating CSS code from blocks
 */

/**
 * Creates CSS for a selector and its declarations
 * @param selectorType Type of selector (element, id, class, combined)
 * @param selector Element selector text
 * @param id ID selector (without #)
 * @param className Class selector (without .)
 * @param pseudo Pseudo-class/element (with : or ::)
 * @param declarations CSS declarations
 * @returns Formatted CSS string
 */
export function createCssSelector(
  selectorType: string,
  selector: string,
  id: string,
  className: string,
  pseudo: string,
  declarations: string
): string {
  let selectorText = '';
  
  // Build selector based on type
  switch (selectorType) {
    case 'element':
      selectorText = selector || 'div'; // Default to div if empty
      break;
    case 'id':
      selectorText = id ? `#${id}` : 'div'; // Default to div if no ID
      break;
    case 'class':
      selectorText = className ? `.${className}` : 'div'; // Default to div if no class
      break;
    case 'combined':
      // Start with element selector if available
      selectorText = selector || '';
      
      // Add ID if provided
      if (id) selectorText += `#${id}`;
      
      // Add class if provided
      if (className) selectorText += `.${className}`;
      
      // Default to div if nothing specified
      if (!selectorText) selectorText = 'div';
      break;
  }
  
  // Add pseudo-class/element if provided
  if (pseudo) {
    // Add colon if not already present
    if (!pseudo.startsWith(':')) {
      selectorText += ':';
    }
    selectorText += pseudo;
  }
  
  return `${selectorText} {\n${declarations}\n}\n`;
}

/**
 * Creates CSS for size properties (width, height)
 * @param property CSS property name
 * @param value Property value
 * @param unit Unit of measurement
 * @returns Formatted CSS property
 */
export function createCssSize(property: string, value: string, unit: string): string {
  if (!value) return '';
  return `  ${property}: ${value}${unit};\n`;
}

/**
 * Creates CSS for position properties
 * @param property Main property (display, position, float)
 * @param value Main property value
 * @param top Top position
 * @param right Right position
 * @param bottom Bottom position
 * @param left Left position
 * @param zIndex Z-index value
 * @param unit Unit for position values
 * @returns Formatted CSS properties
 */
export function createCssPosition(
  property: string, 
  value: string,
  top: string,
  right: string,
  bottom: string,
  left: string,
  zIndex: string,
  unit: string
): string {
  let css = '';
  
  // Add main property if provided
  if (value) css += `  ${property}: ${value};\n`;
  
  // Add position values if provided
  if (top) css += `  top: ${top}${unit};\n`;
  if (right) css += `  right: ${right}${unit};\n`;
  if (bottom) css += `  bottom: ${bottom}${unit};\n`;
  if (left) css += `  left: ${left}${unit};\n`;
  
  // Add z-index if provided
  if (zIndex) css += `  z-index: ${zIndex};\n`;
  
  return css;
}

/**
 * Creates CSS for spacing properties (margin, padding)
 * @param property Spacing property (margin, padding)
 * @param top Top value
 * @param right Right value
 * @param bottom Bottom value
 * @param left Left value
 * @param unit Unit of measurement
 * @returns Formatted CSS property
 */
export function createCssSpacing(
  property: string,
  top: string,
  right: string,
  bottom: string,
  left: string,
  unit: string
): string {
  // If all sides are equal, use shorthand
  if (top && top === right && right === bottom && bottom === left) {
    return `  ${property}: ${top}${unit};\n`;
  }
  
  // If top/bottom and left/right pairs are equal, use 2-value shorthand
  if (top === bottom && right === left) {
    return `  ${property}: ${top}${unit} ${right}${unit};\n`;
  }
  
  // Individual sides if provided
  let css = '';
  if (top) css += `  ${property}-top: ${top}${unit};\n`;
  if (right) css += `  ${property}-right: ${right}${unit};\n`;
  if (bottom) css += `  ${property}-bottom: ${bottom}${unit};\n`;
  if (left) css += `  ${property}-left: ${left}${unit};\n`;
  
  return css;
}

/**
 * Creates CSS for flexbox properties
 * @param direction Flex direction
 * @param justify Justify content
 * @param alignItems Align items
 * @param wrap Flex wrap
 * @param gap Gap value
 * @param gapUnit Gap unit
 * @returns Formatted CSS properties
 */
export function createCssFlexbox(
  direction: string,
  justify: string,
  alignItems: string,
  wrap: string,
  gap: string,
  gapUnit: string
): string {
  let css = '  display: flex;\n';
  
  if (direction) css += `  flex-direction: ${direction};\n`;
  if (justify) css += `  justify-content: ${justify};\n`;
  if (alignItems) css += `  align-items: ${alignItems};\n`;
  if (wrap) css += `  flex-wrap: ${wrap};\n`;
  if (gap) css += `  gap: ${gap}${gapUnit};\n`;
  
  return css;
}

/**
 * Creates CSS for typography properties
 * @param fontSize Font size
 * @param fontSizeUnit Font size unit
 * @param fontWeight Font weight
 * @param color Text color
 * @param textAlign Text alignment
 * @param lineHeight Line height
 * @returns Formatted CSS properties
 */
export function createCssTypography(
  fontSize: string,
  fontSizeUnit: string,
  fontWeight: string,
  color: string,
  textAlign: string,
  lineHeight: string
): string {
  let css = '';
  
  if (fontSize) css += `  font-size: ${fontSize}${fontSizeUnit};\n`;
  if (fontWeight) css += `  font-weight: ${fontWeight};\n`;
  if (color) css += `  color: ${color};\n`;
  if (textAlign) css += `  text-align: ${textAlign};\n`;
  if (lineHeight) css += `  line-height: ${lineHeight};\n`;
  
  return css;
}

/**
 * Creates CSS for border properties
 * @param width Border width
 * @param unit Border width unit
 * @param style Border style
 * @param color Border color
 * @param radius Border radius
 * @param radiusUnit Border radius unit
 * @returns Formatted CSS properties
 */
export function createCssBorder(
  width: string,
  unit: string,
  style: string,
  color: string,
  radius: string,
  radiusUnit: string
): string {
  let css = '';
  
  // If all border properties are provided, use shorthand
  if (width && style && color) {
    css += `  border: ${width}${unit} ${style} ${color};\n`;
  } else {
    // Individual properties if any provided
    if (width) css += `  border-width: ${width}${unit};\n`;
    if (style) css += `  border-style: ${style};\n`;
    if (color) css += `  border-color: ${color};\n`;
  }
  
  // Add border radius if provided
  if (radius) css += `  border-radius: ${radius}${radiusUnit};\n`;
  
  return css;
}

/**
 * Creates CSS for background properties
 * @param color Background color
 * @param image Background image URL
 * @param size Background size
 * @param repeat Background repeat
 * @returns Formatted CSS properties
 */
export function createCssBackground(
  color: string,
  image: string,
  size: string,
  repeat: string
): string {
  let css = '';
  
  if (color) css += `  background-color: ${color};\n`;
  if (image) {
    const imageUrl = image.startsWith('url(') ? image : `url('${image}')`;
    css += `  background-image: ${imageUrl};\n`;
    
    if (size) css += `  background-size: ${size};\n`;
    if (repeat) css += `  background-repeat: ${repeat};\n`;
  }
  
  return css;
}

/**
 * Creates CSS for visual effects
 * @param opacity Opacity value (0-1)
 * @param transform Transform function
 * @param transformValue Transform value
 * @param transformUnit Transform unit
 * @param transition Transition property
 * @param duration Transition duration (seconds)
 * @returns Formatted CSS properties
 */
export function createCssEffects(
  opacity: string,
  transform: string,
  transformValue: string,
  transformUnit: string,
  transition: string,
  duration: string
): string {
  let css = '';
  
  if (opacity) css += `  opacity: ${opacity};\n`;
  
  if (transform && transformValue) {
    css += `  transform: ${transform}(${transformValue}${transformUnit});\n`;
  }
  
  if (transition && duration) {
    css += `  transition: ${transition} ${duration}s;\n`;
  }
  
  return css;
}

/**
 * Creates CSS for a custom property
 * @param property Custom property name
 * @param value Property value
 * @param unit Optional unit of measurement
 * @returns Formatted CSS property
 */
export function createCssCustomProperty(
  property: string,
  value: string,
  unit: string
): string {
  if (!property || !value) return '';
  return `  ${property}: ${value}${unit};\n`;
}

/**
 * Combines multiple CSS declarations into a style sheet
 * @param cssBlocks Array of CSS selector blocks
 * @returns Complete CSS style sheet
 */
export function createStyleSheet(cssBlocks: string[]): string {
  return cssBlocks.join('\n');
} 
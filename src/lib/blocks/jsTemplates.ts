/**
 * JS Templates - Utility functions for generating JavaScript code from blocks
 */

// Add this at the top of your file to track element counters
const elementCounters: Record<string, number> = {};
const containerCounters: Record<string, number> = {};

/**
 * Generate a unique variable name based on element type
 */
function generateVarName(elementType: string, id?: string): string {
  if (id && id.trim() !== '') {
    return id;
  }
  
  // Initialize or increment counter for this element type
  if (!elementCounters[elementType]) {
    elementCounters[elementType] = 1;
  } else {
    elementCounters[elementType]++;
  }
  
  return `el_${elementType}_${elementCounters[elementType]}`;
}

/**
 * Generate a unique container reference variable name
 */
function generateContainerVarName(containerType: string): string {
  // Initialize or increment counter for this container type
  if (!containerCounters[containerType]) {
    containerCounters[containerType] = 1;
  } else {
    containerCounters[containerType]++;
  }
  
  return `container_${containerType}_${containerCounters[containerType]}`;
}

// Define common interfaces
interface ObjectProperty {
    key: string;
    value: string;
  }
  
  // --- Logic & Conditionals ---
  
  export function createIfStatement(condition: string, body: string): string {
    return `if (${condition}) {\n  ${body}\n}`;
  }
  
  export function createIfElseStatement(
    condition: string, 
    ifBody: string, 
    elseBody: string
  ): string {
    return `if (${condition}) {\n  ${ifBody}\n} else {\n  ${elseBody}\n}`;
  }
  
  export function createComparisonExpression(
    left: string, 
    operator: string, 
    right: string
  ): string {
    return `${left} ${operator} ${right}`;
  }
  
  export function createLogicalExpression(
    operator: string,
    left: string, 
    right: string
  ): string {
    return `${left} ${operator} ${right}`;
  }
  
  // --- Loops ---
  
  export function createForLoop(
    init: string, 
    condition: string, 
    update: string, 
    body: string
  ): string {
    return `for (${init}; ${condition}; ${update}) {\n  ${body}\n}`;
  }
  
  export function createWhileLoop(
    condition: string, 
    body: string
  ): string {
    return `while (${condition}) {\n  ${body}\n}`;
  }
  
  export function createForOfLoop(
    variable: string, 
    array: string, 
    body: string
  ): string {
    return `for (const ${variable} of ${array}) {\n  ${body}\n}`;
  }
  
  export function createRepeatLoop(
    times: number, 
    body: string
  ): string {
    return `for (let i = 0; i < ${times}; i++) {\n  ${body}\n}`;
  }
  
  // --- Lists & Arrays ---
  
  export function createList(
    items: string[], 
    name?: string, 
    options?: {
      isConst?: boolean,
      multiline?: boolean
    }
  ): string {
    const declaration = options?.isConst ? 'const' : 'let';
    const nameDecl = name ? `${declaration} ${name} = ` : '';
    const multiline = options?.multiline;
    
    if (multiline) {
      return `${nameDecl}[\n  ${items.join(',\n  ')}\n];`;
    } else {
      return `${nameDecl}[${items.join(', ')}];`;
    }
  }
  
  export function listOperation(
    operation: 'add' | 'remove' | 'replace' | 'clear',
    list: string,
    options?: {
      index?: number,
      item?: string
    }
  ): string {
    switch (operation) {
      case 'add':
        return `${list}.push(${options?.item || ''});`;
      case 'remove':
        return `${list}.splice(${options?.index || 0}, 1);`;
      case 'replace':
        return `${list}[${options?.index || 0}] = ${options?.item || ''};`;
      case 'clear':
        return `${list}.length = 0;`;
      default:
        return '';
    }
  }
  
  export function listQuery(
    query: 'length' | 'includes' | 'indexOf' | 'get',
    list: string,
    item?: string | number
  ): string {
    switch (query) {
      case 'length':
        return `${list}.length`;
      case 'includes':
        return `${list}.includes(${item})`;
      case 'indexOf':
        return `${list}.indexOf(${item})`;
      case 'get':
        return `${list}[${item}]`;
      default:
        return '';
    }
  }
  
  export function listTransform(
    operation: 'sort' | 'filter' | 'map' | 'join',
    list: string,
    options?: {
      expression?: string,
      separator?: string,
      order?: 'ascending' | 'descending'
    }
  ): string {
    switch (operation) {
      case 'sort':
        return `${list}.sort()`;
      case 'filter':
        return `${list}.filter(item => ${options?.expression || 'true'})`;
      case 'map':
        return `${list}.map(item => ${options?.expression || 'item'})`;
      case 'join':
        return `${list}.join("${options?.separator || ','}")`;
      default:
        return '';
    }
  }
  
  // --- Objects & JSON ---
  
  export function createObject(
    properties: ObjectProperty[],
    name?: string,
    options?: {
      isConst?: boolean,
      multiline?: boolean
    }
  ): string {
    const declaration = options?.isConst ? 'const' : 'let';
    const nameDecl = name ? `${declaration} ${name} = ` : '';
    const multiline = options?.multiline;
    
    if (multiline) {
      const props = properties.map(p => `  ${p.key}: ${p.value}`).join(',\n');
      return `${nameDecl}{\n${props}\n};`;
    } else {
      const props = properties.map(p => `${p.key}: ${p.value}`).join(', ');
      return `${nameDecl}{${props}};`;
    }
  }
  
  export function getObjectProperty(
    object: string, 
    property: string
  ): string {
    return `${object}.${property}`;
  }
  
  export function setObjectProperty(
    object: string, 
    property: string, 
    value: string
  ): string {
    return `${object}.${property} = ${value};`;
  }
  
  export function parseJSON(
    jsonString: string, 
    resultVariable?: string
  ): string {
    if (resultVariable) {
      return `const ${resultVariable} = JSON.parse(${jsonString});`;
    }
    return `JSON.parse(${jsonString})`;
  }
  
  export function stringifyObject(
    object: string, 
    pretty?: boolean
  ): string {
    const indent = pretty ? ', 2' : '';
    return `JSON.stringify(${object}${indent})`;
  }
  
  // --- DOM Manipulation ---

  /**
   * Create code for element property operations
   */
  export function elementProperty(
    element: string,
    action: string,
    propertyType: string,
    property: string,
    value: string,
    isExpression: boolean = false,
    loggingLevel: string = 'none'
  ): string {
    let result = '';
    
    if (action === 'get') {
      // Get operations
      if (propertyType === 'text') {
        result = `${element}.textContent`;
      } else if (propertyType === 'html') {
        result = `${element}.innerHTML`;
      } else if (propertyType === 'attribute') {
        result = `${element}.getAttribute('${property}')`;
      } else if (propertyType === 'style') {
        const camel = property.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        result = `${element}.style.${camel}`;
      } else if (propertyType === 'value') {
        result = `${element}.value`;
      }
      
      // Add logging for get operations based on level
      if (loggingLevel === 'basic') {
        return `(function() { const value = ${result}; console.log('GET: ${property} =', value); return value; })()`;
      } else if (loggingLevel === 'detailed') {
        return `(function() { const value = ${result}; console.log('GET: Element ${propertyType} "${property}" from', ${element}, '=', value); return value; })()`;
      }
      
      return result;
    } else { 
      // Set operations
      if (propertyType === 'text') {
        result = `${element}.textContent = ${isExpression ? value : JSON.stringify(value)};`;
      } else if (propertyType === 'html') {
        result = `${element}.innerHTML = ${isExpression ? value : JSON.stringify(value)};`;
      } else if (propertyType === 'attribute') {
        result = `${element}.setAttribute('${property}', ${isExpression ? value : JSON.stringify(value)});`;
      } else if (propertyType === 'style') {
        const camel = property.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        // Handle color properties with !important
        const isColorProperty = /color|background/i.test(property);
        
        if (isColorProperty) {
          // Convert camelCase back to kebab-case for setProperty
          const kebabCase = property.replace(/([A-Z])/g, '-$1').toLowerCase();
          if (isExpression) {
            result = `${element}.style.setProperty('${kebabCase}', ${value}, 'important');`;
          } else {
            const raw = value.replace(/^['"]|['"]$/g, '');
            result = `${element}.style.setProperty('${kebabCase}', '${raw}', 'important');`;
          }
        } else {
          // Normal style properties
          if (isExpression) {
            result = `${element}.style.${camel} = ${value};`;
          } else {
            const raw = value.replace(/^['"]|['"]$/g, '');
            result = `${element}.style.${camel} = '${raw}';`;
          }
        }
      } else if (propertyType === 'value') {
        result = `${element}.value = ${isExpression ? value : JSON.stringify(value)};`;
      }
      
      // Add logging for set operations based on level
      const logValue = isExpression ? value : JSON.stringify(value);
      if (loggingLevel === 'basic') {
        return `console.log('SET: ${property} =', ${logValue});\n${result}`;
      } else if (loggingLevel === 'detailed') {
        return `console.log('SET: Element ${propertyType} "${property}" on', ${element}, 'to', ${logValue});\n${result}`;
      }
      
      return result;
    }
  }
  
  /**
   * Create code for element class operations
   */
  export function elementClass(element: string, action: string, className: string): string {
    if (action === 'add') {
      return `${element}.classList.add('${className}');`;
    } else if (action === 'remove') {
      return `${element}.classList.remove('${className}');`;
    } else if (action === 'toggle') {
      return `${element}.classList.toggle('${className}');`;
    } else if (action === 'contains') {
      return `${element}.classList.contains('${className}')`;
    }
    return '';
  }
  
  /**
   * Create code for event handling
   */
  export function eventHandler(element: string, event: string, handler: string, options: any = {}): string {
    let code = `${element}.addEventListener('${event}', function(event) {\n`;
    if (options.preventDefault) {
      code += '  event.preventDefault();\n';
    }
    code += handler;
    code += '});\n';
    return code;
  }
  
  /**
   * Create code for DOM tree operations
   */
  export function treeOperation(action: string, parent: string, child: string): string {
    if (action === 'append') {
      return `${parent}.appendChild(${child});`;
    } else if (action === 'prepend') {
      return `${parent}.prepend(${child});`;
    } else if (action === 'before') {
      return `${parent}.parentNode.insertBefore(${child}, ${parent});`;
    } else if (action === 'replace') {
      return `${parent}.parentNode.replaceChild(${child}, ${parent});`;
    } else if (action === 'remove') {
      return `${parent}.removeChild(${child});`;
    }
    return '';
  }
  
  /**
   * Create code for iterating through data to create elements
   */
  export function iterateData(dataSource: string, container: string, elementType: string, template: string): string {
    let code = `const container = document.querySelector('${container}');\n`;
    code += `${dataSource}.forEach(function(item) {\n`;
    code += `  const element = document.createElement('${elementType}');\n`;
    code += `  element.innerHTML = \`${template}\`;\n`;
    code += `  container.appendChild(element);\n`;
    code += `});\n`;
    return code;
  }
  
  /**
   * Create code for populating a table with data
   */
  export function populateTable(dataSource: string, table: string, columns: string[], headers: boolean): string {
    let code = `const table = document.querySelector('${table}');\n`;
    code += `table.innerHTML = '';\n`;
    
    if (headers) {
      code += `const headerRow = document.createElement('tr');\n`;
      columns.forEach(column => {
        code += `headerRow.innerHTML += \`<th>${column}</th>\`;\n`;
      });
      code += `table.appendChild(headerRow);\n`;
    }
    
    code += `${dataSource}.forEach(function(item) {\n`;
    code += `  const row = document.createElement('tr');\n`;
    columns.forEach(column => {
      code += `  row.innerHTML += \`<td>\${item.${column}}</td>\`;\n`;
    });
    code += `  table.appendChild(row);\n`;
    code += `});\n`;
    
    return code;
  }
  
  /**
   * Create code for creating elements from a template
   */
  export function createFromTemplate(template: string, dataSource: string, container: string): string {
    let code = `const container = document.querySelector('${container}');\n`;
    code += `container.innerHTML = '';\n`;
    code += `${dataSource}.forEach(function(item) {\n`;
    code += `  const html = \`${template}\`;\n`;
    code += `  const temp = document.createElement('div');\n`;
    code += `  temp.innerHTML = html;\n`;
    code += `  container.appendChild(temp.firstChild);\n`;
    code += `});\n`;
    
    return code;
  }
  
  /**
   * Generate code to modify an existing DOM element
   */
  export function modifyElement(
    element: string,
    isVariable: boolean,
    action: string,
    property: string,
    value: string
  ): string {
    const elementRef = isVariable ? element : `document.getElementById('${element}')`;
    
    switch (action) {
      case 'content':
        return `${elementRef}.innerHTML = \`${value}\`;\n`;
      case 'attribute':
        return `${elementRef}.setAttribute('${property}', \`${value}\`);\n`;
      case 'style':
        return `${elementRef}.style.${property} = \`${value}\`;\n`;
      case 'clear':
        return `${elementRef}.innerHTML = '';\n`;
      default:
        return `// Unknown action: ${action}\n`;
    }
  }
  
  export function createEventListener(
    selector: string,
    eventType: string,
    handler: string,
    options?: {
      preventDefault?: boolean,
      useCapture?: boolean
    }
  ): string {
    const preventDefault = options?.preventDefault ? 'event.preventDefault();' : '';
    const capture = options?.useCapture ? ', true' : '';
    
    return `document.querySelector('${selector}').addEventListener('${eventType}', function(event) {
    ${preventDefault}
    ${handler}
  }${capture});`;
  }
  
  // --- Expressions & Formatting ---
  
  export function formatCurrency(
    amount: string,
    currency: string,
    options?: {
      locale?: string,
      digits?: number
    }
  ): string {
    const locale = options?.locale ? `'${options.locale}'` : "'en-US'";
    const digits = options?.digits !== undefined ? options.digits : 2;
    
    return `new Intl.NumberFormat(${locale}, {
    style: 'currency',
    currency: '${currency}',
    minimumFractionDigits: ${digits}
  }).format(${amount})`;
  }
  
  export function formatDate(
    date: string,
    format: string,
    options?: {
      locale?: string
    }
  ): string {
    const locale = options?.locale ? `'${options.locale}'` : 'undefined';
    
    return `new Date(${date}).toLocaleDateString(${locale}, { dateStyle: '${format}' })`;
  }
  
  export function calculatePercentage(
    value: string,
    total: string,
    decimals?: number
  ): string {
    const dec = decimals !== undefined ? decimals : 2;
    return `(${value} / ${total} * 100).toFixed(${dec})`;
  }
  
  export function createStringTemplate(
    template: string,
    variables: Record<string, string>
  ): string {
    let result = `\`${template}\``;
    
    // Simple implementation that doesn't handle complex substitutions
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(`{${key}}`, `\${${value}}`);
    }
    
    return result;
  }
  
  export function validateInput(
    value: string,
    type: 'email' | 'url' | 'number' | 'regex',
    pattern?: string
  ): string {
    switch (type) {
      case 'email':
        return `(/^\\S+@\\S+\\.\\S+$/).test(${value})`;
      case 'url':
        return `(/^https?:\\/\\/\\S+$/).test(${value})`;
      case 'number':
        return `!isNaN(Number(${value}))`;
      case 'regex':
        return `(/${pattern}/).test(${value})`;
      default:
        return `Boolean(${value})`;
    }
  }
  
  export function createDataOperation(
    operation: 'filter' | 'map' | 'find' | 'reduce',
    array: string,
    expression: string,
    resultVariable?: string
  ): string {
    let result = '';
    
    switch (operation) {
      case 'filter':
        result = `${array}.filter(item => ${expression})`;
        break;
      case 'map':
        result = `${array}.map(item => ${expression})`;
        break;
      case 'find':
        result = `${array}.find(item => ${expression})`;
        break;
      case 'reduce':
        result = `${array}.reduce((acc, item) => ${expression}, 0)`;
        break;
      default:
        return '';
    }
    
    if (resultVariable) {
      return `const ${resultVariable} = ${result};`;
    }
    
    return result;
  }
  
  // --- High-Level Components ---
  
  export function createTabSystem(
    containerId: string,
    tabs: Array<{title: string, content: string}>,
    options?: {
      defaultTab?: number,
      animated?: boolean
    }
  ): string {
    return `// Tab system implementation for ${containerId}
  // with ${tabs.length} tabs
  // Default tab: ${options?.defaultTab || 0}
  // Animated: ${options?.animated || false}`;
  }
  
  export function createModalDialog(
    triggerId: string,
    content: string,
    options?: {
      title?: string,
      closeButton?: boolean,
      backdrop?: boolean
    }
  ): string {
    return `// Modal dialog implementation
  // Trigger: ${triggerId}
  // Title: ${options?.title || 'Modal Dialog'}
  // Close Button: ${options?.closeButton !== false}
  // Backdrop: ${options?.backdrop !== false}`;
  }
  
  export function createDataTable(
    dataSource: string,
    columns: Array<{name: string, field: string}>,
    options?: {
      sortable?: boolean,
      filterable?: boolean,
      pagination?: boolean,
      pageSize?: number
    }
  ): string {
    return `// Data table implementation
  // Data Source: ${dataSource}
  // Columns: ${columns.map(c => c.name).join(', ')}
  // Sortable: ${options?.sortable || false}
  // Filterable: ${options?.filterable || false}
  // Pagination: ${options?.pagination || false}
  // Page Size: ${options?.pageSize || 10}`;
  }
  
  export function createFormValidator(
    formId: string,
    fields: Array<{name: string, rules: string, message?: string}>,
    options?: {
      submitHandler?: string,
      errorClass?: string,
      validateOnBlur?: boolean
    }
  ): string {
    return `// Form validator implementation
  // Form ID: ${formId}
  // Fields: ${fields.map(f => f.name).join(', ')}
  // Submit Handler: ${options?.submitHandler || 'default'}
  // Error Class: ${options?.errorClass || 'error'}
  // Validate on Blur: ${options?.validateOnBlur || false}`;
  }
  
  // --- Reactive Data ---
  
  export function createReactiveStore(
    storeName: string,
    initialData: string
  ): string {
    return `const ${storeName} = createStore(${initialData});`;
  }
  
  export function getReactiveValue(
    storeName: string,
    key: string
  ): string {
    return `${storeName}.get('${key}')`;
  }
  
  export function setReactiveValue(
    storeName: string,
    key: string,
    value: string
  ): string {
    return `${storeName}.set('${key}', ${value});`;
  }
  
  export function setReactiveExpression(
    storeName: string,
    key: string,
    expression: string
  ): string {
    return `${storeName}.set('${key}', ${expression});`;
  }
  
  export function bindReactiveElement(
    selector: string,
    storeName: string,
    key: string,
    attribute: string
  ): string {
    return `${storeName}.bind('${key}', '${selector}', '${attribute}');`;
  }
  
  export function bindReactiveTemplate(
    selector: string,
    storeName: string,
    arrayKey: string,
    schema: string
  ): string {
    return `${storeName}.bindTemplate('${arrayKey}', '${selector}', ${schema});`;
  }
  
  export function listenToReactiveChanges(
    storeName: string,
    key: string,
    handler: string
  ): string {
    return `${storeName}.listen('${key}', (newValue, oldValue) => {
    ${handler}
  });`;
  }
  
  // --- DOM Element Creation ---

  /**
   * Create code for creating a basic DOM element
   */
  export function createElement(
    elementType: string,
    id: string,
    className: string,
    container: string,
    options?: {
      content?: string,
      contentType?: 'html' | 'text' | 'empty',
      attributes?: Record<string, string>
    }
  ): string {
    // Generate variable name using the counter-based approach
    const varName = generateVarName(elementType, id);
    
    let code = `const ${varName} = document.createElement('${elementType}');\n`;
    
    // Only set ID if explicitly provided
    if (id && id.trim() !== '') {
      code += `${varName}.id = '${id}';\n`;
    }
    
    // Add class if provided
    if (className && className.trim() !== '') {
      code += `${varName}.className = '${className}';\n`;
    }
    
    // Add content based on content type
    if (options?.contentType && options.contentType !== 'empty' && options.content) {
      if (options.contentType === 'html') {
        code += `${varName}.innerHTML = \`${options.content}\`;\n`;
      } else {
        code += `${varName}.textContent = \`${options.content}\`;\n`;
      }
    }
    
    // Add attributes if provided
    if (options?.attributes) {
      for (const [key, value] of Object.entries(options.attributes)) {
        code += `${varName}.setAttribute('${key}', '${value}');\n`;
      }
    }
    
    // Add to container
    code += `document.getElementById('${container}').appendChild(${varName});\n`;
    
    return code;
  }

  /**
   * Create code for container elements like div, section, form
   */
  export function createContainerElement(
    tagName: string,
    id: string,
    className: string,
    container: string,
    contentType: 'html' | 'text' | 'empty',
    content: string
  ): string {

    return createElement(tagName, id, className, container, {
      content,
      contentType
    });
  }

  /**
   * Create code for interactive elements like buttons, inputs
   */
  export function createInteractiveElement(
    tagType: string,
    id: string,
    className: string,
    labelText: string,
    container: string,
    attributesJson: string
  ): string {
    // Parse the tag to handle special input types
    let tagName = tagType;
    let type = '';
    
    if (tagType.startsWith('input[')) {
      tagName = 'input';
      type = tagType.substring(6, tagType.length - 1);
    }
    
    // Parse attributes JSON
    let attributes: Record<string, string> = {};
    try {
      attributes = JSON.parse(attributesJson);
    } catch (e) {
      console.error('Invalid JSON for attributes', e);
    }
    
    // Add type attribute for inputs
    if (type) {
      attributes.type = type;
    }
    
    // Handle special cases
    if (tagName === 'button') {
      return createElement(tagName, id, className, container, {
        content: labelText,
        contentType: 'text',
        attributes
      });
    } else if (tagName === 'img') {
      
      attributes.alt = labelText;
      attributes.src = attributes.src || '';
      return createElement(tagName, id, className, container, { attributes });
    } else if (tagName === 'select') {
      let code = createElement(tagName, id, className, container, { attributes });
      // If label text contains options in format "option1:value1,option2:value2"
      if (labelText) {
        const options = labelText.split(',');
        for (const option of options) {
          const [text, value] = option.split(':').map(s => s.trim());
          code += `const option_${text.replace(/\s+/g, '_')} = document.createElement('option');\n`;
          code += `option_${text.replace(/\s+/g, '_')}.textContent = '${text}';\n`;
          if (value) {
            code += `option_${text.replace(/\s+/g, '_')}.value = '${value}';\n`;
          }
          code += `${id}.appendChild(option_${text.replace(/\s+/g, '_')});\n`;
        }
      }
      return code;
    } else {
      // For other input types
      if (labelText && !['input[checkbox]', 'input[radio]'].includes(tagType)) {
        attributes.placeholder = attributes.placeholder || labelText;
      }
      
      let code = createElement(tagName, id, className, container, { attributes });
      
      // Add label for checkbox and radio
      if (['input[checkbox]', 'input[radio]'].includes(tagType) && labelText) {
        const labelId = `${id}_label`;
        code += `const ${labelId} = document.createElement('label');\n`;
        code += `${labelId}.htmlFor = '${id}';\n`;
        code += `${labelId}.textContent = '${labelText}';\n`;
        code += `document.getElementById('${container}').appendChild(${labelId});\n`;
      }
      
      return code;
    }
  }

  /**
   * Create code for text elements like headings, paragraphs, links
   */
  export function createTextElement(
    tagName: string,
    id: string,
    className: string,
    content: string,
    container: string,
    href: string = ''
  ): string {
    // Make sure we have a valid variable name
    const varName = generateVarName(tagName, id);
    
    let code = `const ${varName} = document.createElement('${tagName}');\n`;
    
    // Add ID if provided
    if (id && id.trim() !== '') {
      code += `${varName}.id = '${id}';\n`;
    }
    
    // Add class if provided
    if (className && className.trim() !== '') {
      code += `${varName}.className = '${className}';\n`;
    }
    
    // Add content
    if (content) {
      code += `${varName}.textContent = \`${content}\`;\n`;
    }
    
    // Add href for links
    if (tagName === 'a' && href) {
      code += `${varName}.href = '${href}';\n`;
    }
    
    // Add to container
    code += `document.getElementById('${container}').appendChild(${varName});\n`;
    
    return code;
  }

  /**
   * Create code for structured elements like lists and tables
   */
  export function createStructuredElement(
    structureType: string,
    id: string,
    className: string,
    container: string,
    dataSource: string = '',
    itemTemplate: string = '',
    items: string = ''
  ): string {
    // Create unique variable name for the element
    const varName = generateVarName(structureType, id);
    
    let code = `const ${varName} = document.createElement('${structureType}');\n`;
    
    // Add ID if provided
    if (id && id.trim() !== '') {
      code += `${varName}.id = '${id}';\n`;
    }
    
    // Add class if provided
    if (className && className.trim() !== '') {
      code += `${varName}.className = '${className}';\n`;
    }
    
    // Add to container with error handling
    const containerVarName = generateContainerVarName(structureType);
    code += `const ${containerVarName} = document.getElementById('${container}');\n`;
    code += `if (${containerVarName}) {\n`;
    code += `  ${containerVarName}.appendChild(${varName});\n`;
    code += `} else {\n`;
    code += `  console.error('Container #${container} not found, using document.body instead');\n`;
    code += `  document.body.appendChild(${varName});\n`;
    code += `}\n`;
    
    // Handle data source if provided
    if (dataSource && dataSource.trim() !== '') {
      // Data-driven content generation
      if (['ul', 'ol'].includes(structureType)) {
        code += `${dataSource}.forEach(function(item) {\n`;
        const liVarName = generateVarName('li');
        code += `  const ${liVarName} = document.createElement('li');\n`;
        code += `  ${liVarName}.innerHTML = \`${itemTemplate}\`;\n`;
        code += `  ${varName}.appendChild(${liVarName});\n`;
        code += `});\n`;
      } else if (structureType === 'table') {
        // Assuming itemTemplate is a row template
        code += `${dataSource}.forEach(function(item) {\n`;
        const trVarName = generateVarName('tr');
        code += `  const ${trVarName} = document.createElement('tr');\n`;
        code += `  ${trVarName}.innerHTML = \`${itemTemplate}\`;\n`;
        code += `  ${varName}.appendChild(${trVarName});\n`;
        code += `});\n`;
      } else if (structureType === 'dl') {
        code += `${dataSource}.forEach(function(item) {\n`;
        const dtVarName = generateVarName('dt');
        const ddVarName = generateVarName('dd');
        code += `  const ${dtVarName} = document.createElement('dt');\n`;
        code += `  ${dtVarName}.innerHTML = \`${itemTemplate.split('|')[0] || '${item.term}'}\`;\n`;
        code += `  const ${ddVarName} = document.createElement('dd');\n`;
        code += `  ${ddVarName}.innerHTML = \`${itemTemplate.split('|')[1] || '${item.description}'}\`;\n`;
        code += `  ${varName}.appendChild(${dtVarName});\n`;
        code += `  ${varName}.appendChild(${ddVarName});\n`;
        code += `});\n`;
      }
    } 
    // Handle manual items
    else if (items && items.trim() !== '') {
      const itemList = items.split(',').map(item => item.trim());
      
      if (['ul', 'ol'].includes(structureType)) {
        itemList.forEach((item, index) => {
          const liVarName = generateVarName('li');
          code += `const ${liVarName} = document.createElement('li');\n`;
          code += `${liVarName}.textContent = '${item}';\n`;
          code += `${varName}.appendChild(${liVarName});\n`;
        });
      } else if (structureType === 'table') {
        // Simple table with one column for manual items
        const theadVarName = generateVarName('thead');
        const tbodyVarName = generateVarName('tbody');
        code += `const ${theadVarName} = document.createElement('thead');\n`;
        code += `const ${tbodyVarName} = document.createElement('tbody');\n`;
        code += `${varName}.appendChild(${theadVarName});\n`;
        code += `${varName}.appendChild(${tbodyVarName});\n`;
        
        itemList.forEach((item, index) => {
          const trVarName = generateVarName('tr');
          const tdVarName = generateVarName('td');
          code += `const ${trVarName} = document.createElement('tr');\n`;
          code += `const ${tdVarName} = document.createElement('td');\n`;
          code += `${tdVarName}.textContent = '${item}';\n`;
          code += `${trVarName}.appendChild(${tdVarName});\n`;
          code += `${tbodyVarName}.appendChild(${trVarName});\n`;
        });
      } else if (structureType === 'dl') {
        itemList.forEach((item, index) => {
          const [term, desc] = item.split(':').map(s => s.trim());
          if (term) {
            const dtVarName = generateVarName('dt');
            code += `const ${dtVarName} = document.createElement('dt');\n`;
            code += `${dtVarName}.textContent = '${term}';\n`;
            code += `${varName}.appendChild(${dtVarName});\n`;
            
            if (desc) {
              const ddVarName = generateVarName('dd');
              code += `const ${ddVarName} = document.createElement('dd');\n`;
              code += `${ddVarName}.textContent = '${desc}';\n`;
              code += `${varName}.appendChild(${ddVarName});\n`;
            }
          }
        });
      }
    }
    
    return code;
  }

  /**
   * Generate code to delete a DOM element
   */
  export function deleteElement(
    element: string,
    isVariable: boolean
  ): string {
    const elementRef = isVariable ? element : `document.getElementById('${element}')`;
    return `if (${elementRef}) {\n  ${elementRef}.remove();\n}\n`;
  }

  /**
   * Generate code to clone a DOM element
   */
  export function cloneElement(
    source: string,
    newId: string,
    deep: boolean,
    container: string
  ): string {
    return `const ${newId} = document.getElementById('${source}').cloneNode(${deep});\n` +
           `${newId}.id = '${newId}';\n` +
           `document.getElementById('${container}').appendChild(${newId});\n`;
  }

  /**
   * Create structured items like list items, table rows, table cells
   */
  export function createStructuredItem(
    itemType: string,
    id: string,
    className: string,
    container: string,
    contentType: 'single' | 'multiple',
    content: string,
    optionValues: string = '',
    separator: string = ',',
    attributes: Record<string, string> | string = {}
  ): string {
    let code = '';
    
    // Parse attributes if provided as string
    if (typeof attributes === 'string') {
      try {
        attributes = JSON.parse(attributes);
      } catch (e) {
        console.error('Invalid JSON for attributes', e);
        attributes = {};
      }
    }
    
    // Special handling for option elements
    if (itemType === 'option') {
      const optionTexts = content.split(separator).map(item => item.trim()).filter(item => item);
      const optionValueArray = optionValues ? optionValues.split(separator).map(item => item.trim()) : [];
      
      // Ensure we have enough values (use text as value if not provided)
      while (optionValueArray.length < optionTexts.length) {
        optionValueArray.push(optionTexts[optionValueArray.length]);
      }
      
      // Create option elements
      optionTexts.forEach((text, index) => {
        const varName = generateVarName('option');
        
        code += `const ${varName} = document.createElement('option');\n`;
        
        if (id && id.trim() !== '' && contentType === 'single') {
          code += `${varName}.id = '${id}';\n`;
        } else if (id && id.trim() !== '') {
          code += `${varName}.id = '${id}_${index}';\n`;
        }
        
        if (className && className.trim() !== '') {
          code += `${varName}.className = '${className}';\n`;
        }
        
        code += `${varName}.textContent = \`${text}\`;\n`;
        code += `${varName}.value = \`${optionValueArray[index]}\`;\n`;
        
        // Add attributes
        if (typeof attributes === 'object') {
          for (const [key, value] of Object.entries(attributes)) {
            code += `${varName}.setAttribute('${key}', '${value}');\n`;
          }
        }
        
        // Safe container reference with incremental naming
        const containerVarName = generateContainerVarName('option');
        code += `const ${containerVarName} = document.getElementById('${container}');\n`;
        code += `if (${containerVarName}) {\n`;
        code += `  ${containerVarName}.appendChild(${varName});\n`;
        code += `} else {\n`;
        code += `  console.error('Container #${container} not found');\n`;
        code += `}\n`;
      });
      
      return code;
    }
    
    // For other item types (li, tr, td, etc.)
    if (contentType === 'single') {
      // Create a single item
      const varName = generateVarName(itemType, id);
      
      code += `const ${varName} = document.createElement('${itemType}');\n`;
      
      // Add ID if provided
      if (id && id.trim() !== '') {
        code += `${varName}.id = '${id}';\n`;
      }
      
      // Add class if provided
      if (className && className.trim() !== '') {
        code += `${varName}.className = '${className}';\n`;
      }
      
      // Add content
      if (content && content.trim() !== '') {
        code += `${varName}.textContent = \`${content}\`;\n`;
      }
      
      // Add attributes
      if (typeof attributes === 'object') {
        for (const [key, value] of Object.entries(attributes)) {
          code += `${varName}.setAttribute('${key}', '${value}');\n`;
        }
      }
      
      // Safe container reference with incremental naming
      const containerVarName = generateContainerVarName(itemType);
      code += `const ${containerVarName} = document.getElementById('${container}');\n`;
      code += `if (${containerVarName}) {\n`;
      code += `  ${containerVarName}.appendChild(${varName});\n`;
      code += `} else {\n`;
      code += `  console.error('Container #${container} not found');\n`;
      code += `}\n`;
    } else {
      // Create multiple items
      const items = content.split(separator).map(item => item.trim()).filter(item => item);
      
      // Special handling for table rows with cells
      if (itemType === 'tr' && items.length > 0) {
        const trVarName = generateVarName('tr', id);
        
        code += `const ${trVarName} = document.createElement('tr');\n`;
        
        // Add ID if provided
        if (id && id.trim() !== '') {
          code += `${trVarName}.id = '${id}';\n`;
        }
        
        // Add class if provided
        if (className && className.trim() !== '') {
          code += `${trVarName}.className = '${className}';\n`;
        }
        
        // Create cell for each item
        items.forEach((item, index) => {
          const tdVarName = generateVarName('td');
          
          code += `const ${tdVarName} = document.createElement('td');\n`;
          code += `${tdVarName}.textContent = \`${item}\`;\n`;
          code += `${trVarName}.appendChild(${tdVarName});\n`;
        });
        
        // Safe container reference with incremental naming
        const containerVarName = generateContainerVarName('tr');
        code += `const ${containerVarName} = document.getElementById('${container}');\n`;
        code += `if (${containerVarName}) {\n`;
        code += `  ${containerVarName}.appendChild(${trVarName});\n`;
        code += `} else {\n`;
        code += `  console.error('Container #${container} not found');\n`;
        code += `}\n`;
      } else {
        // For other item types, create multiple separate items
        items.forEach((item, index) => {
          const varName = generateVarName(itemType);
          
          code += `const ${varName} = document.createElement('${itemType}');\n`;
          
          // Add ID with index for uniqueness if provided
          if (id && id.trim() !== '') {
            code += `${varName}.id = '${id}_${index}';\n`;
          }
          
          // Add class if provided
          if (className && className.trim() !== '') {
            code += `${varName}.className = '${className}';\n`;
          }
          
          // Add content
          code += `${varName}.textContent = \`${item}\`;\n`;
          
          // Add attributes
          if (typeof attributes === 'object') {
            for (const [key, value] of Object.entries(attributes)) {
              code += `${varName}.setAttribute('${key}', '${value}');\n`;
            }
          }
          
          // Safe container reference with incremental naming
          const containerVarName = generateContainerVarName(itemType);
          code += `const ${containerVarName} = document.getElementById('${container}');\n`;
          code += `if (${containerVarName}) {\n`;
          code += `  ${containerVarName}.appendChild(${varName});\n`;
          code += `} else {\n`;
          code += `  console.error('Container #${container} not found');\n`;
          code += `}\n`;
        });
      }
    }
    
    return code;
  }

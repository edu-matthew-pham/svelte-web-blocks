/**
 * JS Templates - Utility functions for generating JavaScript code from blocks
 */

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
  isExpression: boolean = false
): string {
  if (action === 'get') {
    if (propertyType === 'text') {
      return `${element}.textContent`;
    } else if (propertyType === 'html') {
      return `${element}.innerHTML`;
    } else if (propertyType === 'attribute') {
      return `${element}.getAttribute('${property}')`;
    } else if (propertyType === 'style') {
      const camel = property.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return `${element}.style.${camel}`;
    } else if (propertyType === 'value') {
      return `${element}.value`;
    }
  } else { // set
    if (propertyType === 'text') {
      return `${element}.textContent = ${isExpression ? value : JSON.stringify(value)};`;
    } else if (propertyType === 'html') {
      return `${element}.innerHTML = ${isExpression ? value : JSON.stringify(value)};`;
    } else if (propertyType === 'attribute') {
      return `${element}.setAttribute('${property}', ${isExpression ? value : JSON.stringify(value)});`;
    } else if (propertyType === 'style') {
      const camel = property.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (isExpression) {
        return `${element}.style.${camel} = ${value};`;
      } else {
        const raw = value.replace(/^['"]|['"]$/g, '');
        return `${element}.style.${camel} = '${raw}';`;
      }
    } else if (propertyType === 'value') {
      return `${element}.value = ${isExpression ? value : JSON.stringify(value)};`;
    }
  }
  return '';
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
  
  export function modifyElement(
    selector: string,
    action: 'text' | 'html' | 'class' | 'attribute' | 'style' | 'toggleClass',
    options?: {
      property?: string,
      value?: string
    }
  ): string {
    switch (action) {
      case 'text':
        return `document.querySelector('${selector}').textContent = ${options?.value || '""'};`;
      case 'html':
        return `document.querySelector('${selector}').innerHTML = ${options?.value || '""'};`;
      case 'class':
        return `document.querySelector('${selector}').className = ${options?.value || '""'};`;
      case 'attribute':
        return `document.querySelector('${selector}').setAttribute('${options?.property || ''}', ${options?.value || '""'});`;
      case 'style':
        return `document.querySelector('${selector}').style.${options?.property || ''} = ${options?.value || '""'};`;
      case 'toggleClass':
        return `document.querySelector('${selector}').classList.toggle('${options?.value || ''}');`;
      default:
        return '';
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
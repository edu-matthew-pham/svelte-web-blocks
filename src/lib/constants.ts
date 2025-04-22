/**
 * Common icons used throughout the application
 */
export const COMMON_ICONS = [
  { value: 'none', text: 'None', symbol: '' },
  { value: 'search', text: 'Search 🔍', symbol: '🔍' },
  { value: 'cart', text: 'Cart 🛒', symbol: '🛒' },
  { value: 'user', text: 'User 👤', symbol: '👤' },
  { value: 'settings', text: 'Settings ⚙️', symbol: '⚙️' },
  { value: 'heart', text: 'Heart ❤️', symbol: '❤️' },
  { value: 'star', text: 'Star ⭐', symbol: '⭐' },
  { value: 'arrow', text: 'Arrow →', symbol: '→' }
];

/**
 * Interactive-specific icons
 */
export const INTERACTIVE_ICONS = [
  ...COMMON_ICONS,
  { value: 'plus', text: 'Plus ➕', symbol: '➕' },
  { value: 'minus', text: 'Minus ➖', symbol: '➖' },
  { value: 'check', text: 'Check ✓', symbol: '✓' },
  { value: 'x', text: 'X ✗', symbol: '✗' }
];

/**
 * Common button styles
 */
export const BUTTON_STYLES = [
  { value: 'primary', text: 'Primary' },
  { value: 'secondary', text: 'Secondary' },
  { value: 'tertiary', text: 'Tertiary' },
  { value: 'outline', text: 'Outline' },
  { value: 'text', text: 'Text only' }
];

/**
 * Common sizes for UI elements
 */
export const ELEMENT_SIZES = [
  { value: 'small', text: 'Small' },
  { value: 'medium', text: 'Medium' },
  { value: 'large', text: 'Large' }
];

/**
 * Interaction types
 */
export const INTERACTION_TYPES = [
  { value: 'button', text: 'Button' },
  { value: 'toggle', text: 'Toggle' },
  { value: 'slider', text: 'Slider' },
  { value: 'input', text: 'Input' },
  { value: 'dropdown', text: 'Dropdown' }
];

/**
 * Action types for interactive elements
 */
export const ACTION_TYPES = [
  { value: 'function', text: 'Call function' },
  { value: 'url', text: 'Open URL' },
  { value: 'toggle_class', text: 'Toggle class' },
  { value: 'toggle_visibility', text: 'Show/hide element' }
];

/**
 * Input field types
 */
export const INPUT_TYPES = [
  { value: 'text', text: 'Text' },
  { value: 'number', text: 'Number' },
  { value: 'email', text: 'Email' },
  { value: 'password', text: 'Password' },
  { value: 'search', text: 'Search' }
];

/**
 * Position options (for icons, labels, etc.)
 */
export const POSITIONS = [
  { value: 'left', text: 'Left' },
  { value: 'right', text: 'Right' }
];

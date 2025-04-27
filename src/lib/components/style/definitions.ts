import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';
import * as Blockly from 'blockly/core';

// Define CSS block configurations
const styleBlockConfigs: WebBlockConfigs = {
  // CSS Selector Block
  css_selector: {
    type: 'css_selector',
    category: 'css',
    color: 210,
    tooltip: "Define a CSS selector to target elements",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "CSS Selector" },
        { type: "field_dropdown", name: "SELECTOR_TYPE", options: [
          ["Element", "element"],
          ["ID", "id"],
          ["Class", "class"],
          ["Combined", "combined"],
          ["Descendant", "descendant"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Selector" },
        { type: "field_dropdown", name: "SELECTOR", options: [
          ["none", ""],
          ["div", "div"],
          ["p", "p"],
          ["h1", "h1"],
          ["h2", "h2"],
          ["h3", "h3"],
          ["span", "span"],
          ["a", "a"],
          ["ul", "ul"],
          ["ol", "ol"],
          ["li", "li"],
          ["button", "button"],
          ["input", "input"],
          ["form", "form"],
          ["section", "section"],
          ["article", "article"],
          ["main", "main"],
          ["header", "header"],
          ["footer", "footer"],
          ["nav", "nav"],
          ["table", "table"],
          ["body", "body"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "ID" },
        { type: "field_text", name: "ID", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Class" },
        { type: "field_text", name: "CLASS", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Pseudo-class/element" },
        { type: "field_text", name: "PSEUDO", default: "" }
      ]},
      { type: "statement", name: "DECLARATIONS", check: "css_property" }
    ],
    connections: { previous: "css_selector", next: "css_selector" },
    schema: {
      type: "object",
      title: "CSS Selector",
      description: "Define a CSS selector to target elements",
      properties: {
        SELECTOR_TYPE: {
          type: "string",
          description: "Type of CSS selector",
          enum: ["element", "id", "class", "combined", "descendant"],
          default: "element"
        },
        SELECTOR: {
          type: "string",
          description: "Element selector",
          enum: ["", "div", "p", "h1", "h2", "h3", "span", "a", "ul", "ol", "li", "button", "input", "form", "section", "article", "main", "header", "footer", "nav", "table", "body"]
        },
        ID: {
          type: "string",
          description: "ID selector (without #)"
        },
        CLASS: {
          type: "string",
          description: "Class selector (without .)"
        },
        PSEUDO: {
          type: "string",
          description: "Pseudo-class or pseudo-element (e.g., hover, before)"
        },
        DECLARATIONS: {
          type: "array",
          description: "CSS property declarations",
          items: {
            type: "object"
          }
        }
      },
      required: ["SELECTOR_TYPE"]
    }
  },
  
  // Size Block (width/height)
  css_size: {
    type: 'css_size',
    category: 'css',
    color: 210,
    tooltip: "Set size-related properties",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/width",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Property" },
        { type: "field_dropdown", name: "PROPERTY", options: [
          ["width", "width"],
          ["height", "height"],
          ["max-width", "max-width"],
          ["min-width", "min-width"],
          ["max-height", "max-height"],
          ["min-height", "min-height"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Value" },
        { type: "field_text", name: "VALUE", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Unit" },
        { type: "field_dropdown", name: "UNIT", options: [
          ["", ""],
          ["px", "px"],
          ["%", "%"],
          ["em", "em"],
          ["rem", "rem"],
          ["vw", "vw"],
          ["vh", "vh"]
        ]}
      ]}
    ],
    connections: { previous: "css_property", next: "css_property" },
    schema: {
      type: "object",
      title: "Size Property",
      description: "Set size-related CSS properties",
      properties: {
        PROPERTY: {
          type: "string",
          description: "Size property to set",
          enum: ["width", "height", "max-width", "min-width", "max-height", "min-height"],
          default: "width"
        },
        VALUE: {
          type: "string",
          description: "Numeric value"
        },
        UNIT: {
          type: "string",
          description: "Measurement unit",
          enum: ["", "px", "%", "em", "rem", "vw", "vh"],
          default: "px"
        }
      },
      required: ["PROPERTY", "VALUE"]
    }
  },
  
  // Position Block
  css_position: {
    type: 'css_position',
    category: 'css',
    color: 210,
    tooltip: "Set position and display properties",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/position",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Property" },
        { type: "field_dropdown", name: "PROPERTY", options: [
          ["display", "display"],
          ["position", "position"],
          ["float", "float"],
          ["overflow", "overflow"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Value" },
        { type: "field_dropdown", name: "VALUE", options: [
          ["", ""],
          ["block", "block"],
          ["inline", "inline"],
          ["flex", "flex"],
          ["grid", "grid"],
          ["inline-block", "inline-block"],
          ["none", "none"],
          ["static", "static"],
          ["relative", "relative"],
          ["absolute", "absolute"],
          ["fixed", "fixed"],
          ["sticky", "sticky"],
          ["left", "left"],
          ["right", "right"],
          ["visible", "visible"],
          ["hidden", "hidden"],
          ["auto", "auto"],
          ["scroll", "scroll"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Top" },
        { type: "field_text", name: "TOP", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Right" },
        { type: "field_text", name: "RIGHT", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Bottom" },
        { type: "field_text", name: "BOTTOM", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Left" },
        { type: "field_text", name: "LEFT", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Z-Index" },
        { type: "field_text", name: "ZINDEX", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Unit" },
        { type: "field_dropdown", name: "UNIT", options: [
          ["", ""],
          ["px", "px"],
          ["%", "%"],
          ["em", "em"],
          ["rem", "rem"]
        ]}
      ]}
    ],
    connections: { previous: "css_property", next: "css_property" },
    schema: {
      type: "object",
      title: "Position Property",
      description: "Set position and display properties",
      properties: {
        PROPERTY: {
          type: "string",
          description: "Position property to set",
          enum: ["display", "position", "float", "overflow"],
          default: "position"
        },
        VALUE: {
          type: "string",
          description: "Property value",
          enum: ["", "block", "inline", "flex", "grid", "inline-block", "none", "static", "relative", "absolute", "fixed", "sticky", "left", "right", "visible", "hidden", "auto", "scroll"]
        },
        TOP: {
          type: "string",
          description: "Top position value"
        },
        RIGHT: {
          type: "string",
          description: "Right position value"
        },
        BOTTOM: {
          type: "string",
          description: "Bottom position value"
        },
        LEFT: {
          type: "string",
          description: "Left position value"
        },
        ZINDEX: {
          type: "string",
          description: "Z-index value"
        },
        UNIT: {
          type: "string",
          description: "Measurement unit",
          enum: ["", "px", "%", "em", "rem"]
        }
      },
      required: ["PROPERTY"]
    }
  },
  
  // Spacing Block
  css_spacing: {
    type: 'css_spacing',
    category: 'css',
    color: 210,
    tooltip: "Set margin or padding for all sides of an element",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Property" },
        { type: "field_dropdown", name: "PROPERTY", options: [
          ["margin", "margin"],
          ["padding", "padding"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Top" },
        { type: "field_text", name: "TOP", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Right" },
        { type: "field_text", name: "RIGHT", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Bottom" },
        { type: "field_text", name: "BOTTOM", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Left" },
        { type: "field_text", name: "LEFT", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Unit" },
        { type: "field_dropdown", name: "UNIT", options: [
          ["px", "px"],
          ["%", "%"],
          ["em", "em"],
          ["rem", "rem"]
        ]}
      ]}
    ],
    connections: { previous: "css_property", next: "css_property" },
    schema: {
      type: "object",
      title: "Spacing Property",
      description: "Set margin or padding for all sides of an element",
      properties: {
        PROPERTY: {
          type: "string",
          description: "Spacing property to set",
          enum: ["margin", "padding"],
          default: "margin"
        },
        TOP: {
          type: "string",
          description: "Top spacing value"
        },
        RIGHT: {
          type: "string",
          description: "Right spacing value"
        },
        BOTTOM: {
          type: "string",
          description: "Bottom spacing value"
        },
        LEFT: {
          type: "string",
          description: "Left spacing value"
        },
        UNIT: {
          type: "string",
          description: "Measurement unit",
          enum: ["px", "%", "em", "rem"],
          default: "px"
        }
      },
      required: ["PROPERTY"]
    }
  },
  
  // Flexbox Block
  css_flexbox: {
    type: 'css_flexbox',
    category: 'css',
    color: 210,
    tooltip: "Set flexbox layout properties",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Flex Direction" },
        { type: "field_dropdown", name: "DIRECTION", options: [
          ["", ""],
          ["row", "row"],
          ["column", "column"],
          ["row-reverse", "row-reverse"],
          ["column-reverse", "column-reverse"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Justify Content" },
        { type: "field_dropdown", name: "JUSTIFY", options: [
          ["", ""],
          ["flex-start", "flex-start"],
          ["center", "center"],
          ["flex-end", "flex-end"],
          ["space-between", "space-between"],
          ["space-around", "space-around"],
          ["space-evenly", "space-evenly"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Align Items" },
        { type: "field_dropdown", name: "ALIGN_ITEMS", options: [
          ["", ""],
          ["flex-start", "flex-start"],
          ["center", "center"],
          ["flex-end", "flex-end"],
          ["stretch", "stretch"],
          ["baseline", "baseline"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Flex Wrap" },
        { type: "field_dropdown", name: "WRAP", options: [
          ["", ""],
          ["nowrap", "nowrap"],
          ["wrap", "wrap"],
          ["wrap-reverse", "wrap-reverse"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Gap" },
        { type: "field_text", name: "GAP", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Gap Unit" },
        { type: "field_dropdown", name: "GAP_UNIT", options: [
          ["", ""],
          ["px", "px"],
          ["%", "%"],
          ["em", "em"],
          ["rem", "rem"]
        ]}
      ]}
    ],
    connections: { previous: "css_property", next: "css_property" },
    schema: {
      type: "object",
      title: "Flexbox Properties",
      description: "Set flexbox layout properties",
      properties: {
        DIRECTION: {
          type: "string",
          description: "Flex direction",
          enum: ["", "row", "column", "row-reverse", "column-reverse"]
        },
        JUSTIFY: {
          type: "string",
          description: "Justify content alignment",
          enum: ["", "flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"]
        },
        ALIGN_ITEMS: {
          type: "string",
          description: "Align items",
          enum: ["", "flex-start", "center", "flex-end", "stretch", "baseline"]
        },
        WRAP: {
          type: "string",
          description: "Flex wrap behavior",
          enum: ["", "nowrap", "wrap", "wrap-reverse"]
        },
        GAP: {
          type: "string",
          description: "Gap between flex items"
        },
        GAP_UNIT: {
          type: "string",
          description: "Gap measurement unit",
          enum: ["", "px", "%", "em", "rem"]
        }
      }
    }
  },
  
  // Typography Block
  css_typography: {
    type: 'css_typography',
    category: 'css',
    color: 210,
    tooltip: "Set text styling properties",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-size",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Font Size" },
        { type: "field_text", name: "FONT_SIZE", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Unit" },
        { type: "field_dropdown", name: "FONT_SIZE_UNIT", options: [
          ["", ""],
          ["px", "px"],
          ["em", "em"],
          ["rem", "rem"],
          ["%", "%"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Font Weight" },
        { type: "field_dropdown", name: "FONT_WEIGHT", options: [
          ["", ""],
          ["normal", "normal"],
          ["bold", "bold"],
          ["lighter", "lighter"],
          ["bolder", "bolder"],
          ["100", "100"],
          ["200", "200"],
          ["300", "300"],
          ["400", "400"],
          ["500", "500"],
          ["600", "600"],
          ["700", "700"],
          ["800", "800"],
          ["900", "900"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Color" },
        { type: "field_color", name: "COLOR", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Text Align" },
        { type: "field_dropdown", name: "TEXT_ALIGN", options: [
          ["", ""],
          ["left", "left"],
          ["center", "center"],
          ["right", "right"],
          ["justify", "justify"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Line Height" },
        { type: "field_text", name: "LINE_HEIGHT", default: "" }
      ]}
    ],
    connections: { previous: "css_property", next: "css_property" },
    schema: {
      type: "object",
      title: "Typography Properties",
      description: "Set text styling properties",
      properties: {
        FONT_SIZE: {
          type: "string",
          description: "Font size value"
        },
        FONT_SIZE_UNIT: {
          type: "string",
          description: "Font size unit",
          enum: ["", "px", "em", "rem", "%"],
          default: "px"
        },
        FONT_WEIGHT: {
          type: "string",
          description: "Font weight",
          enum: ["", "normal", "bold", "lighter", "bolder", "100", "200", "300", "400", "500", "600", "700", "800", "900"]
        },
        COLOR: {
          type: "string",
          description: "Text color (hex code)",
          pattern: "^#[0-9A-Fa-f]{6}$"
        },
        TEXT_ALIGN: {
          type: "string",
          description: "Text alignment",
          enum: ["", "left", "center", "right", "justify"]
        },
        LINE_HEIGHT: {
          type: "string",
          description: "Line height value"
        }
      }
    }
  },
  
  // Border Block
  css_border: {
    type: 'css_border',
    category: 'css',
    color: 210,
    tooltip: "Set border properties",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/border",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Width" },
        { type: "field_text", name: "WIDTH", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Unit" },
        { type: "field_dropdown", name: "UNIT", options: [
          ["", ""],
          ["px", "px"],
          ["em", "em"],
          ["rem", "rem"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Style" },
        { type: "field_dropdown", name: "STYLE", options: [
          ["", ""],
          ["solid", "solid"],
          ["dashed", "dashed"],
          ["dotted", "dotted"],
          ["double", "double"],
          ["none", "none"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Color" },
        { type: "field_color", name: "COLOR", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Border Radius" },
        { type: "field_text", name: "RADIUS", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Radius Unit" },
        { type: "field_dropdown", name: "RADIUS_UNIT", options: [
          ["", ""],
          ["px", "px"],
          ["%", "%"],
          ["em", "em"],
          ["rem", "rem"]
        ]}
      ]}
    ],
    connections: { previous: "css_property", next: "css_property" },
    schema: {
      type: "object",
      title: "Border Properties",
      description: "Set border styling properties",
      properties: {
        WIDTH: {
          type: "string",
          description: "Border width value"
        },
        UNIT: {
          type: "string",
          description: "Border width unit",
          enum: ["", "px", "em", "rem"],
          default: "px"
        },
        STYLE: {
          type: "string",
          description: "Border style",
          enum: ["", "solid", "dashed", "dotted", "double", "none"],
          default: "solid"
        },
        COLOR: {
          type: "string",
          description: "Border color (hex code)",
          pattern: "^#[0-9A-Fa-f]{6}$"
        },
        RADIUS: {
          type: "string",
          description: "Border radius value"
        },
        RADIUS_UNIT: {
          type: "string",
          description: "Border radius unit",
          enum: ["", "px", "%", "em", "rem"],
          default: "px"
        }
      }
    }
  },
  
  // Background Block
  css_background: {
    type: 'css_background',
    category: 'css',
    color: 210,
    tooltip: "Set background properties",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/background",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Background Color" },
        { type: "field_color", name: "COLOR", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Background Image URL" },
        { type: "field_text", name: "IMAGE", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Background Size" },
        { type: "field_dropdown", name: "SIZE", options: [
          ["", ""],
          ["cover", "cover"],
          ["contain", "contain"],
          ["auto", "auto"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Background Repeat" },
        { type: "field_dropdown", name: "REPEAT", options: [
          ["", ""],
          ["repeat", "repeat"],
          ["no-repeat", "no-repeat"],
          ["repeat-x", "repeat-x"],
          ["repeat-y", "repeat-y"]
        ]}
      ]}
    ],
    connections: { previous: "css_property", next: "css_property" },
    schema: {
      type: "object",
      title: "Background Properties",
      description: "Set background styling properties",
      properties: {
        COLOR: {
          type: "string",
          description: "Background color (hex code)",
          pattern: "^#[0-9A-Fa-f]{6}$"
        },
        IMAGE: {
          type: "string",
          description: "Background image URL"
        },
        SIZE: {
          type: "string",
          description: "Background size",
          enum: ["", "cover", "contain", "auto"]
        },
        REPEAT: {
          type: "string",
          description: "Background repeat",
          enum: ["", "repeat", "no-repeat", "repeat-x", "repeat-y"]
        }
      }
    }
  },
  
  // Effects Block
  css_effects: {
    type: 'css_effects',
    category: 'css',
    color: 210,
    tooltip: "Set visual effects like transitions and transforms",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Opacity (0-1)" },
        { type: "field_text", name: "OPACITY", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Transform" },
        { type: "field_dropdown", name: "TRANSFORM", options: [
          ["", ""],
          ["translate", "translate"],
          ["scale", "scale"],
          ["rotate", "rotate"],
          ["skew", "skew"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Transform Value" },
        { type: "field_text", name: "TRANSFORM_VALUE", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Unit" },
        { type: "field_dropdown", name: "TRANSFORM_UNIT", options: [
          ["", ""],
          ["px", "px"],
          ["deg", "deg"],
          ["%", "%"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Transition Property" },
        { type: "field_dropdown", name: "TRANSITION", options: [
          ["", ""],
          ["all", "all"],
          ["color", "color"],
          ["background", "background"],
          ["transform", "transform"],
          ["opacity", "opacity"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Duration (seconds)" },
        { type: "field_text", name: "DURATION", default: "" }
      ]}
    ],
    connections: { previous: "css_property", next: "css_property" },
    schema: {
      type: "object",
      title: "Effects Properties",
      description: "Set visual effects like transitions and transforms",
      properties: {
        OPACITY: {
          type: "string",
          description: "Opacity value (0-1)"
        },
        TRANSFORM: {
          type: "string",
          description: "Transform function",
          enum: ["", "translate", "scale", "rotate", "skew"]
        },
        TRANSFORM_VALUE: {
          type: "string",
          description: "Transform function value"
        },
        TRANSFORM_UNIT: {
          type: "string",
          description: "Transform value unit",
          enum: ["", "px", "deg", "%"]
        },
        TRANSITION: {
          type: "string",
          description: "CSS property to transition",
          enum: ["", "all", "color", "background", "transform", "opacity"]
        },
        DURATION: {
          type: "string",
          description: "Transition duration in seconds"
        }
      }
    }
  },
  
  // Custom Property Block
  css_custom: {
    type: 'css_custom',
    category: 'css',
    color: 210,
    tooltip: "Define any custom CSS property",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Property" },
        { type: "field_text", name: "PROPERTY", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Value" },
        { type: "field_text", name: "VALUE", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Unit (if applicable)" },
        { type: "field_text", name: "UNIT", default: "" }
      ]}
    ],
    connections: { previous: "css_property", next: "css_property" },
    schema: {
      type: "object",
      title: "Custom CSS Property",
      description: "Define any custom CSS property",
      properties: {
        PROPERTY: {
          type: "string",
          description: "CSS property name"
        },
        VALUE: {
          type: "string",
          description: "CSS property value"
        },
        UNIT: {
          type: "string",
          description: "Unit for the value (if applicable)"
        }
      },
      required: ["PROPERTY", "VALUE"]
    }
  }
};

// Create and export the CSS block definitions
export const styleDefinitions = createBlockDefinitions(styleBlockConfigs); 
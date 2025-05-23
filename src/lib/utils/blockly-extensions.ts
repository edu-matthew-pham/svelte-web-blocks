import * as Blockly from 'blockly/core';
import type { BlockSvg } from 'blockly/core';

export interface VisibilityConfig {
  /** name of the dropdown field that drives visibility */
  dropdownField: string;
  /** map each field/input name → list of dropdown-values when it should be visible */
  visibilityMap: Record<string, string[]>;
}

// Store configurations to register later
const pendingExtensions: Array<{name: string, config: VisibilityConfig}> = [];

// Track which extensions have been registered
const registeredExtensions = new Set<string>();

/**
 * Registers an extension which will show/hide fields or inputs
 * based on the value of a given dropdown.
 */
export function registerVisibilityExtension(
  extensionName: string,
  cfg: VisibilityConfig
) {
  // Store configuration for later registration
  pendingExtensions.push({name: extensionName, config: cfg});
}

/**
 * Initialize all pending visibility extensions.
 * This should be called after Blockly is fully loaded.
 */
export function initializeVisibilityExtensions() {
  if (!Blockly.Extensions) {
    console.error('Blockly.Extensions is not available');
    return;
  }

  pendingExtensions.forEach(({name, config}) => {
    // Check if extension is already registered in Blockly itself
    // This is more reliable than our local tracking
    try {
      if (Blockly.Extensions.isRegistered(name)) {
        console.debug(`Extension "${name}" is already registered in Blockly, skipping.`);
        return;
      }
    } catch (e) {
      // If isRegistered throws an error, consider it not registered
    }

    // Skip if this extension is already registered in our local tracking
    if (registeredExtensions.has(name)) {
      console.debug(`Extension "${name}" is already registered in our tracking, skipping.`);
      return;
    }

    Blockly.Extensions.register(name, function(this: BlockSvg) {
      const update = () => {
        // Get the CURRENT value from the dropdown
        const value = this.getFieldValue(config.dropdownField);
        
        for (const [fieldOrInput, allowedValues] of Object.entries(config.visibilityMap)) {
          const visible = allowedValues.includes(value);

          
          // Check if field exists
          const f = this.getField(fieldOrInput);
          const inp = this.getInput(fieldOrInput);

          
          if (inp && typeof inp.setVisible === 'function') {
            inp.setVisible(visible);
          }
          
          if (f) {
            if (typeof f.setVisible === 'function') {
              f.setVisible(visible);
            }
          }
        }
        this.render();
      };
      
      // Check if the dropdown field exists
      const dropdown = this.getField(config.dropdownField);
      
      if (!dropdown) {
        console.error(`Cannot find dropdown field "${config.dropdownField}" in block`);
        return;
      }
      
      // Run initial update
      update();
      
      // Set up the validator for FUTURE changes
      dropdown.setValidator((newValue) => {
        // Use the newValue directly from the event

        
        // Schedule update for next tick to ensure field has updated
        setTimeout(update, 0);
        
        return newValue;
      });
    });

    // Mark this extension as registered
    registeredExtensions.add(name);
  });
}
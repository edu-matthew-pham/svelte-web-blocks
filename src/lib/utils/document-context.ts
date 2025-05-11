// src/lib/utils/document-context.ts

// Define interface for document settings
export interface DocumentSettings {
    useBootstrap: boolean;
    theme: string;
    [key: string]: any; // Allow for future extensibility
  }
  
  // Default settings
  const defaultSettings: DocumentSettings = {
    useBootstrap: true,
    theme: 'light'
  };
  
  // Current settings (private to module)
  let currentSettings: DocumentSettings = {...defaultSettings};
  
  // Export the context object with getter and setter methods
  export const documentContext = {
    /**
     * Get current document settings
     */
    getSettings: (): DocumentSettings => ({...currentSettings}),
    
    /**
     * Get specific setting by key
     */
    getSetting: <K extends keyof DocumentSettings>(key: K): DocumentSettings[K] => 
      currentSettings[key],
    
    /**
     * Update document settings
     */
    updateSettings: (newSettings: Partial<DocumentSettings>): void => {
      currentSettings = {...currentSettings, ...newSettings};
    },
    
    /**
     * Reset settings to defaults
     */
    resetSettings: (): void => {
      currentSettings = {...defaultSettings};
    },
    
    /**
     * Check if Bootstrap is enabled
     */
    isBootstrapEnabled: (): boolean => currentSettings.useBootstrap
  };
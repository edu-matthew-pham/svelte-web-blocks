/**
 * Preview safety utilities to prevent and handle problematic code execution
 * such as infinite loops, long-running scripts, and errors in previewed code.
 * Uses proper HTML parsing for robust handling of various HTML structures.
 */

export interface PreviewSafetyOptions {
  /** Maximum time in ms to wait for preview to load before timing out (default: 5000) */
  timeoutDuration?: number;
  /** Custom message to show when timeout occurs */
  timeoutMessage?: string;
  /** Custom message to show when infinite loop is detected */
  infiniteLoopMessage?: string;
  /** Time in ms to consider script as potentially having an infinite loop (default: 3000) */
  infiniteLoopThreshold?: number;
  /** Whether to intercept console messages (default: true) */
  captureConsole?: boolean;
  /** Whether to add sandbox attributes to iframe (default: true) */
  useSandbox?: boolean;
  /** Custom sandbox attributes (default: "allow-scripts allow-same-origin") */
  sandboxAttributes?: string;
  /** Whether to show alerts in the preview when issues are detected (default: false) */
  showAlertsInPreview?: boolean;
  /** Whether to add visual error overlay in the preview (default: false) */
  showErrorOverlay?: boolean;
  /** Custom CSS styles to inject into the preview */
  customStyles?: string;
}

export interface PreviewError {
  message: string;
  type: 'timeout' | 'error' | 'infiniteLoop';
  timestamp: string;
}

export interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
}

export type PreviewEventListener = (event: PreviewError | ConsoleMessage) => void;

export interface PreviewSafety {
  wrapCode: (code: string) => string;
  resetPreview: (iframe: HTMLIFrameElement) => void;
  handlePreviewLoad: () => void;
  addEventListeners: (listener: PreviewEventListener) => void;
  removeEventListeners: () => void;
  cleanup: () => void;
  hasError: boolean;
  isLoading: boolean;
  currentError: PreviewError | null;
  analyzeCode: (code: string) => string;
}

/**
 * Creates a safety wrapper for previewing potentially unsafe code
 * @param options Configuration options for the preview safety
 * @returns Methods and properties to manage safe code previews
 */
export function createPreviewSafety(options?: PreviewSafetyOptions): PreviewSafety {
  const isBrowser = typeof window !== 'undefined';

  const config = {
    timeoutDuration: options?.timeoutDuration ?? 5000,
    timeoutMessage: options?.timeoutMessage ?? 'Preview timed out. Your code may contain an infinite loop or is taking too long to execute.',
    infiniteLoopMessage: options?.infiniteLoopMessage ?? 'Script execution took too long and may contain an infinite loop',
    infiniteLoopThreshold: options?.infiniteLoopThreshold ?? 3000,
    captureConsole: options?.captureConsole ?? true,
    useSandbox: options?.useSandbox ?? true,
    sandboxAttributes: options?.sandboxAttributes ?? 'allow-scripts allow-same-origin',
    showAlertsInPreview: options?.showAlertsInPreview ?? false,
    showErrorOverlay: options?.showErrorOverlay ?? false
  };

  let previewTimeout: number | null = null;
  let isLoading = false;
  let currentError: PreviewError | null = null;
  const eventListeners: PreviewEventListener[] = [];

  /**
   * Generate the safety script content to be injected
   */
  function generateSafetyScript(): string {
    return `
      // Set up error handling
      window.onerror = function(msg, url, line, col, error) {
        const errorMessage = msg + ' (Line ' + line + ')';
        window.parent.postMessage({
          source: 'preview-console',
          type: 'error',
          message: errorMessage,
          timestamp: new Date().toISOString()
        }, '*');
        
        ${config.showAlertsInPreview ? `
        // Show alert for errors
        console.error("Preview Error:", errorMessage);
        if (!window.__previewErrorShown) {
          window.__previewErrorShown = true;
          alert("Preview Error: " + errorMessage);
        }
        ` : ''}
        
        ${config.showErrorOverlay ? `
        // Add visual error overlay
        showErrorOverlay(errorMessage);
        ` : ''}
        
        return true;
      };
      
      ${config.showErrorOverlay ? `
      // Function to show error overlay
      function showErrorOverlay(message) {
        let overlay = document.getElementById('preview-error-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.id = 'preview-error-overlay';
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.right = '0';
          overlay.style.padding = '10px';
          overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
          overlay.style.color = 'white';
          overlay.style.fontFamily = 'monospace';
          overlay.style.fontSize = '14px';
          overlay.style.zIndex = '9999';
          document.body.appendChild(overlay);
        }
        overlay.textContent = "Error: " + message;
      }
      ` : ''}
      
      ${config.captureConsole ? `
      // Override console methods
      ['log', 'error', 'warn', 'info'].forEach(function(method) {
        const originalMethod = console[method];
        console[method] = function(...args) {
          originalMethod.apply(console, args);
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' ');
          window.parent.postMessage({
            source: 'preview-console',
            type: method,
            message: message,
            timestamp: new Date().toISOString()
          }, '*');
        };
      });
      ` : ''}
      
      // Add execution time limit guard
      try {
        const startTime = Date.now();
        let counter = 0;
        const interval = setInterval(function() {
          counter++;
          const elapsedTime = Date.now() - startTime;
          if (elapsedTime > ${config.infiniteLoopThreshold} && counter < 3) { // Detect frozen JS
            clearInterval(interval);
            const infiniteLoopMessage = '${config.infiniteLoopMessage}';
            
            window.parent.postMessage({
              source: 'preview-console',
              type: 'infiniteLoop',
              message: infiniteLoopMessage,
              timestamp: new Date().toISOString()
            }, '*');
            
            ${config.showAlertsInPreview ? `
            // Show alert for infinite loops
            console.error("Preview Issue:", infiniteLoopMessage);
            if (!window.__infiniteLoopAlertShown) {
              window.__infiniteLoopAlertShown = true;
              alert("Preview Issue: " + infiniteLoopMessage);
            }
            ` : ''}
            
            ${config.showErrorOverlay ? `
            // Add visual error overlay for infinite loops
            showErrorOverlay(infiniteLoopMessage);
            ` : ''}
          }
          if (counter > 10) clearInterval(interval);
        }, 300);
        
        // Additional protection for common infinite loop patterns
        let iterationCount = 0;
        const maxIterations = 10000;
        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;
        
        // Override setTimeout to prevent recursive timeouts
        window.setTimeout = function(callback, delay, ...args) {
          iterationCount++;
          if (iterationCount > maxIterations) {
            const message = 'Too many setTimeout calls detected - possible infinite recursion';
            
            window.parent.postMessage({
              source: 'preview-console',
              type: 'infiniteLoop',
              message: message,
              timestamp: new Date().toISOString()
            }, '*');
            
            ${config.showAlertsInPreview ? `
            console.error("Preview Issue:", message);
            if (!window.__timeoutRecursionAlertShown) {
              window.__timeoutRecursionAlertShown = true;
              alert("Preview Issue: " + message);
            }
            ` : ''}
            
            ${config.showErrorOverlay ? `
            showErrorOverlay(message);
            ` : ''}
            
            return 0;
          }
          return originalSetTimeout(callback, delay, ...args);
        };
        
        // Override setInterval to prevent too many intervals
        window.setInterval = function(callback, delay, ...args) {
          iterationCount++;
          if (iterationCount > maxIterations / 10) {
            const message = 'Too many setInterval calls detected';
            
            window.parent.postMessage({
              source: 'preview-console',
              type: 'infiniteLoop',
              message: message,
              timestamp: new Date().toISOString()
            }, '*');
            
            ${config.showAlertsInPreview ? `
            console.error("Preview Issue:", message);
            if (!window.__intervalOveruseAlertShown) {
              window.__intervalOveruseAlertShown = true;
              alert("Preview Issue: " + message);
            }
            ` : ''}
            
            ${config.showErrorOverlay ? `
            showErrorOverlay(message);
            ` : ''}
            
            return 0;
          }
          return originalSetInterval(callback, delay, ...args);
        };
      } catch (e) {
        console.error('Runtime check setup failed:', e);
      }
    `;
  }

  /**
   * Analyzes code for potential infinite loops
   * @param code The code to analyze
   * @returns Transformed code with safety checks
   */
  function transformCodeWithSafetyChecks(code: string): string {
    // Simple static analysis for common infinite loop patterns
    const whileLoopRegex = /while\s*\(\s*([\s\S]*?)\s*\)\s*\{/g;
    const forLoopRegex = /for\s*\(\s*([\s\S]*?)\s*\)\s*\{/g;
    
    // Add iteration counters to while loops
    let safeCode = code.replace(whileLoopRegex, (match, condition) => {
      return `
        // Safety: while loop protection
        let __safetyLoopCounter = 0;
        while ((${condition}) && __safetyLoopCounter++ < 10000) {
          if (__safetyLoopCounter >= 10000) {
            console.error("Infinite loop protection triggered for while loop with condition: ${condition.replace(/"/g, '\\"')}");
            if (typeof showErrorOverlay === 'function') {
              showErrorOverlay("Potential infinite loop detected in while loop");
            }
            break;
          }
      `;
    });
    
    // Add iteration counters to for loops
    safeCode = safeCode.replace(forLoopRegex, (match, initCondIncr) => {
      return `
        // Safety: for loop protection
        let __safetyLoopCounter = 0;
        for (${initCondIncr}) {
          if (__safetyLoopCounter++ >= 10000) {
            console.error("Infinite loop protection triggered in for loop");
            if (typeof showErrorOverlay === 'function') {
              showErrorOverlay("Potential infinite loop detected in for loop");
            }
            break;
          }
      `;
    });
    
    return safeCode;
  }
  /**
   * Wraps the user's HTML with safety code
   */
  function wrapCode(html: string): string {
    // Extract scripts from the HTML for transformation
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let modifiedHtml = html;
    
    // Process all script tags
    while (match = scriptRegex.exec(html)) {
      const originalScript = match[0];
      const scriptContent = match[1];
      
      // Skip empty scripts
      if (!scriptContent.trim()) continue;
      
      // Transform the script content with safety checks
      const safeScriptContent = transformCodeWithSafetyChecks(scriptContent);
      
      // Replace the original script with the safe version
      const safeScript = originalScript.replace(scriptContent, safeScriptContent);
      modifiedHtml = modifiedHtml.replace(originalScript, safeScript);
    }
    
    // Create a full HTML document with the safety script at the top
    const safeHtml = `<!DOCTYPE html>
<html>
<head>
  <script>
    ${generateSafetyScript()}
  </script>
  ${modifiedHtml.includes('<head>') ? modifiedHtml.replace('<head>', '<head>') : `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${modifiedHtml.includes('<body') ? '' : '<style>' + (options?.customStyles || '') + '</style>'}
</head>
<body>
  ${modifiedHtml.includes('<body') ? modifiedHtml : modifiedHtml}
</body>`}
</html>`;

    return safeHtml;
  }

  /**
   * Reset an iframe preview
   */
  function resetPreview(iframe: HTMLIFrameElement): void {
    if (!iframe) return;
    
    iframe.src = 'about:blank';
    currentError = null;
    
    // Small delay to ensure the iframe is cleared before setting new content
    setTimeout(() => {
      startLoading();
    }, 100);
  }

  /**
   * Handle when the preview has finished loading
   */
  function handlePreviewLoad(): void {
    if (previewTimeout) {
      clearTimeout(previewTimeout);
      previewTimeout = null;
    }
    isLoading = false;
  }

  /**
   * Set up the loading state and timeout
   */
  function startLoading(): void {
    if (previewTimeout) {
      clearTimeout(previewTimeout);
    }
    
    isLoading = true;
    currentError = null;
    
    // Set a timeout to detect if the preview takes too long to load
    previewTimeout = window.setTimeout(() => {
      const timeoutError: PreviewError = {
        type: 'timeout',
        message: config.timeoutMessage,
        timestamp: new Date().toISOString()
      };
      
      currentError = timeoutError;
      isLoading = false;
      
      // Notify listeners of the timeout
      eventListeners.forEach(listener => listener(timeoutError));
    }, config.timeoutDuration);
  }

  /**
   * Add global event listener for messages from the iframe
   */
  function setupMessageListeners(): void {
    if (!isBrowser) return;
    window.addEventListener('message', handlePreviewMessage);
  }

  /**
   * Handle messages coming from the preview iframe
   */
  function handlePreviewMessage(event: MessageEvent): void {
    if (event.data?.source !== 'preview-console') return;

    const { type, message, timestamp } = event.data;

    if (type === 'infiniteLoop') {
      const infiniteLoopError: PreviewError = {
        type: 'infiniteLoop',
        message,
        timestamp
      };
      currentError = infiniteLoopError;
      eventListeners.forEach(listener => listener(infiniteLoopError));
    } else if (type === 'error') {
      const errorEvent: PreviewError = {
        type: 'error',
        message,
        timestamp
      };
      eventListeners.forEach(listener => listener(errorEvent));
    } else {
      const consoleEvent: ConsoleMessage = {
        type: type as 'log' | 'error' | 'warn' | 'info',
        message,
        timestamp
      };
      eventListeners.forEach(listener => listener(consoleEvent));
    }
  }

  /**
   * Add an event listener to receive notifications about preview events
   */
  function addEventListeners(listener: PreviewEventListener): void {
    if (!eventListeners.length) {
      setupMessageListeners();
    }
    eventListeners.push(listener);
  }

  /**
   * Remove all event listeners
   */
  function removeEventListeners(): void {
    eventListeners.length = 0;
    if (isBrowser) {
      window.removeEventListener('message', handlePreviewMessage);
    }
  }

  /**
   * Clean up all resources and listeners
   */
  function cleanup(): void {
    if (previewTimeout) {
      clearTimeout(previewTimeout);
      previewTimeout = null;
    }
    removeEventListeners();
  }

  // Initialize event listeners only in browser environment
  if (isBrowser) {
    setupMessageListeners();
  }
  
  return {
    wrapCode,
    resetPreview,
    handlePreviewLoad,
    addEventListeners,
    removeEventListeners,
    cleanup,
    get hasError() { return currentError !== null; },
    get isLoading() { return isLoading; },
    get currentError() { return currentError; },
    analyzeCode: transformCodeWithSafetyChecks
  };
}

/**
 * Creates sandbox attributes for an iframe based on provided options
 */
export function getSandboxAttributes(options?: PreviewSafetyOptions): string {
  if (options?.useSandbox === false) return '';
  // Modified to use allow-scripts only by default, to prevent sandbox escape
  return options?.sandboxAttributes ?? 'allow-scripts';
}

/**
 * Helper function to create a safe iframe element
 */
export function createSafeIframe(
  container: HTMLElement, 
  code: string, 
  safety: PreviewSafety,
  options?: PreviewSafetyOptions
): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.className = 'preview-iframe';
  iframe.title = 'Component Preview';
  
  if (options?.useSandbox !== false) {
    // Modified to use allow-scripts only by default
    iframe.sandbox.value = options?.sandboxAttributes ?? 'allow-scripts';
  }
  
  iframe.srcdoc = safety.wrapCode(code);
  iframe.addEventListener('load', safety.handlePreviewLoad);
  
  container.appendChild(iframe);
  return iframe;
} 
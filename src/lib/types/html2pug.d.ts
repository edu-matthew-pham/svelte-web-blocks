declare module 'html2pug' {
  interface Html2PugOptions {
    /** Process the HTML as a fragment (not a complete HTML document) */
    fragment?: boolean;
    /** Use commas in attributes */
    commas?: boolean;
    /** Use double quotes for attributes */
    doubleQuotes?: boolean;
    /** Number of spaces to use for indentation */
    spaces?: number;
    /** Use tabs instead of spaces for indentation */
    tabs?: boolean;
    /** Generate PUG code that's OK with deno */
    deno?: boolean;
  }
  
  function html2pug(html: string, options?: Html2PugOptions): string;
  
  export = html2pug;
} 
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	interface Window {
		__blocklyParsers: Record<string, any>;
	}
	interface JavascriptGenerator {
		blockToHighLevel(block: Blockly.Block): any;
		forBlock: {
		  [key: string]: {
			(block: Blockly.Block): string | [string, number] | null;
			highLevel?: (block: Blockly.Block) => any;
		  };
		};
	  }
}

export {};

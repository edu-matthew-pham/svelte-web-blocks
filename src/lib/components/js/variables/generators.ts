export const variableGenerators = {
    text_multiline_js: (text: string) => {
        return `const ${text} = \`${text}\`;`;
    }
}
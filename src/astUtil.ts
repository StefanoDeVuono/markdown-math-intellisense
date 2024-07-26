import * as vscode from 'vscode'

let remark: any;
let math: any;
let processor : any;

Promise.all([
  import('remark'),
  import('remark-math')
]).then(([remarkImport, mathImport]) => {
  remark = remarkImport.remark;
  math = mathImport.default;
  processor = remark().use(math)
}).catch(error => {
  console.error('Failed to load modules:', error);
});


export type Node = {
  type: string;
  children?: Node[];
  lang?: string;
  meta?: string;
  value?: string;
  position: {
    start: { line: number, column: number, offset: number };
    end: { line: number, column: number, offset: number };
    indent?: number[];
  }
}

export function rangeOfNode(node: Node) : vscode.Range {
  if (remark && math) {
    const {start, end} = node.position
    if (node.type === 'code') {
        return new vscode.Range(start.line, 0, end.line - 2, 1000)
    }
    return new vscode.Range(start.line - 1, start.column - 1, end.line - 1, end.column - 1)
  } else {
    console.error('Modules not yet loaded');
    throw new Error('Modules not yet loaded')
  }
}

function isNodeIncludingPosition(node: Node, position: vscode.Position) {
    const range = rangeOfNode(node)
    return range.contains(position)
}

export function findNode(text: string, position: vscode.Position) {
    const ast: Node = processor.parse(text) as Node
    const nodeArrayStack: Node[][] = []
    if (ast.children) {
        nodeArrayStack.push(ast.children)
    }
    while (true) {
        const children = nodeArrayStack.pop()
        if (children === undefined) {
            break
        }
        for (const node of children) {
            if (node.type.match(/text|code|html|inlineMath|math/)) {
                if (isNodeIncludingPosition(node, position)) {
                    return node
                }
            } else {
                if (node.children) {
                    nodeArrayStack.push(node.children)
                }
            }
        }
    }
    return undefined
}

export function getLanguageId(node: Node) {
    if (node.type === 'html') {
        return 'html'
    }
    if (node.type === 'inlineMath' || node.type === 'math') {
        return 'latex'
    }
    if (node.type === 'code') {
        return node.lang
    }
    return
}

export function getLanguageSuffix(lang: string) {
  // const configuration = vscode.workspace.getConfiguration('vscode-markdown-intellisense')
  // const extensionObj = configuration.get('languageFilenameExtensionList') as { [key: string]: string }
    if (lang ==='latex') return 'tex'
}
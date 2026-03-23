import * as vscode from 'vscode'

import { remark } from 'remark'
import math from 'remark-math'

const processor  = remark().use(math)
const LEAF_TYPES = new Set(['text', 'code', 'html', 'inlineMath', 'math'])


let cachedAst: Node | undefined
let cachedUri: string | undefined
let cachedVersion: number | undefined

function getParsedAst(document: vscode.TextDocument): Node {
  if (cachedUri === document.uri.toString() && cachedVersion === document.version && cachedAst) {
    return cachedAst
  }
  cachedAst = processor.parse(document.getText()) as Node
  cachedUri = document.uri.toString()
  cachedVersion = document.version
  return cachedAst
}


export type Node = {
  type: string
  children?: Node[]
  lang?: string
  meta?: string
  value?: string
  position: {
    start: { line: number; column: number; offset: number }
    end: { line: number; column: number; offset: number }
    indent?: number[]
  }
}

export function parseDocumentForLatex(document: vscode.TextDocument, position: vscode.Position) {

  const node = findNode(document, position)
  if (!node) return

  const languageId = getLanguageId(node)
  if (languageId === 'latex') return rangeOfNode(node)

  // Fallback: check for unclosed inline math delimiter
  const lineText = document.lineAt(position.line).text
  const textBeforeCursor = lineText.substring(0, position.character)
  const dollars = textBeforeCursor.match(/(?<!\\)\$/g)
  if (dollars && dollars.length % 2 === 1) {
    const dollarIndex = textBeforeCursor.lastIndexOf('$')
    return new vscode.Range(position.line, dollarIndex, position.line, position.character)
  }
}

function rangeOfNode(node: Node): vscode.Range {
  const { start, end } = node.position
  if (node.type === 'code') {
    return new vscode.Range(start.line, 0, end.line - 2, 1000)
  }
  return new vscode.Range(start.line - 1, start.column - 1, end.line - 1, end.column - 1)
}

function isNodeIncludingPosition(node: Node, position: vscode.Position) {
  const { start, end } = node.position
  const line = position.line + 1
  const column = position.character + 1

  if (line < start.line || line > end.line) return false
  if (line === start.line && column < start.column) return false
  if (line === end.line && column > end.column) return false
  return true
}

function findNode(document: vscode.TextDocument, position: vscode.Position) {
  const ast = getParsedAst(document)

  const nodeArrayStack: Node[][] = []
  if (ast.children) {
    nodeArrayStack.push(ast.children)
  }
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const children = nodeArrayStack.pop()
    if (children === undefined) {
      break
    }
    for (const node of children) {
      if (LEAF_TYPES.has(node.type)) {
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

function getLanguageId(node: Node) {
  if (node.type === 'html')  return 'html'
  if (node.type === 'inlineMath' || node.type === 'math')  return 'latex'
  if (node.type === 'code') return node.lang
  return
}

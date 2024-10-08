import * as vscode from 'vscode'

import { remark } from 'remark'
import math from 'remark-math'

const processor  = remark().use(math)

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
  const content = document.getText()

  const node = findNode(content, position)
  if (!node) return

  const languageId = getLanguageId(node)
  if (languageId !== 'latex') return

  return rangeOfNode(node)

}

function rangeOfNode(node: Node): vscode.Range {
  const { start, end } = node.position
  if (node.type === 'code') {
    return new vscode.Range(start.line, 0, end.line - 2, 1000)
  }
  return new vscode.Range(start.line - 1, start.column - 1, end.line - 1, end.column - 1)
}

function isNodeIncludingPosition(node: Node, position: vscode.Position) {
  const range = rangeOfNode(node)
  return range.contains(position)
}

function findNode(text: string, position: vscode.Position) {
  const ast: Node = processor.parse(text) as Node
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
  return ast
}

function getLanguageId(node: Node) {
  if (node.type === 'html')  return 'html'
  if (node.type === 'inlineMath' || node.type === 'math')  return 'latex'
  if (node.type === 'code') return node.lang
  return
}

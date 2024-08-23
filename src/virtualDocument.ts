import { Position, TextDocument as VSCodeTextDocument, Uri, Range } from 'vscode'
import { Node, getLanguageId, getLanguageSuffix, rangeOfNode } from './astUtil.js'
import {TextDocument} from 'vscode-languageserver-textdocument'
export const scheme = 'markdown-embed-content'

export class VirtualDocument extends Map<string, string> {
  static scheme = 'embedded-content'
  uri: Uri | undefined
  position: Position | undefined

  updateMathContent(document: VSCodeTextDocument, node: Node, position: Position) {
    let range = rangeOfNode(node)
    if (!range.contains(position)) return

    const languageId = getLanguageId(node)
    if (languageId !== 'latex') return

    const suffix = getLanguageSuffix(languageId)
    if (!suffix) return

    const originalUri = document.uri.toString(true)
    // range = new Range(range.start.line + 1, range.start.character, range.end.line - 1, range.end.character)
    let content = document.getText(range)
    this.set(originalUri, content)
    const vdocUriString = `${VirtualDocument.scheme}://tex/${encodeURIComponent(originalUri)}.tex`
    this.uri = Uri.parse(vdocUriString)
    this.position = new Position(position.line - range.start.line, position.character)
  }
}

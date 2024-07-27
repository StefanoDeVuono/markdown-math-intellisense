import { Position, TextDocument, Uri } from 'vscode'
import { Node, getLanguageId, getLanguageSuffix, rangeOfNode } from './astUtil.js'

export const scheme = 'markdown-embed-content'

export class VirtualDocument extends Map<string, string> {
  uri: Uri | undefined
  position: Position | undefined

  update(document: TextDocument, node: Node, position: Position) {
    const range = rangeOfNode(node)
    if (!range.contains(position)) {
      return
  }
    const languageId = getLanguageId(node)
    if (!languageId) {
        return
    }
    const suffix = getLanguageSuffix(languageId)
    if (!suffix) {
      return
    }
    const originalUri = document.uri.toString(true);
    this.set(originalUri, document.getText(range))
    const vdocUriString = `embedded-content://${suffix}/${encodeURIComponent(originalUri )}.${suffix}`
    this.uri = Uri.parse(vdocUriString)
    this.position = new Position(position.line - range.start.line, position.character)
  }
}


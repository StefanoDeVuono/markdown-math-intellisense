import { commands, CompletionContext, CompletionItemProvider, CompletionList, Position, TextDocument } from 'vscode'
import { findNode } from './astUtil.js'
import { VirtualDocument } from './virtualDocument.js'

export class MarkdownCompletionItem implements CompletionItemProvider {
  virtualDocument: VirtualDocument

  constructor(virtualDocument: VirtualDocument) {
    this.virtualDocument = virtualDocument
  }

  async provideCompletionItems(document: TextDocument, position: Position, _: any, context: CompletionContext) {
    const node = findNode(document.getText(), position)
    if (!node) return

    let itemList

    this.virtualDocument.updateMathContent!(document, node, position)
    const vdocUri = this.virtualDocument.uri
    const virtualPosition = this.virtualDocument.position

    if (!vdocUri || !virtualPosition) return

    try {
      itemList = await commands.executeCommand<CompletionList>(
        'vscode.executeCompletionItemProvider',
        vdocUri,
        virtualPosition,
        context.triggerCharacter,
        10
      )
    } catch (error) {
      console.error(error)
    }

    if (!itemList) {
      return
    }
    for (const item of itemList.items) {
      item.range = undefined
      item.insertText = undefined
    }
    return itemList
  }
}

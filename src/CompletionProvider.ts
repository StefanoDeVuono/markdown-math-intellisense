import { commands, CompletionContext, CompletionItemProvider, CompletionList, Position, TextDocument } from 'vscode'
import { parseDocumentForLatex } from './astUtil.js'
import { VirtualDocument } from './virtualDocument.js'

export class MarkdownCompletionItem implements CompletionItemProvider {
  virtualDocument: VirtualDocument

  constructor(virtualDocument: VirtualDocument) {
    this.virtualDocument = virtualDocument
  }


  async provideCompletionItems(document: TextDocument, position: Position, _: any, context: CompletionContext) {
    const range = parseDocumentForLatex(document, position)
    
    if (!range || !range.contains(position)) return

    const originalUri = document.uri.toString(true)
    let content = document.getText(range)

    let itemList

    this.virtualDocument.set(originalUri, content)
    const virtualDocumentUri = this.virtualDocument.uri
    const virtualPosition = new Position(position.line - range.start.line, position.character)

    if (!virtualDocumentUri || !virtualPosition) return

    try {
      itemList = await commands.executeCommand<CompletionList>(
        'vscode.executeCompletionItemProvider',
        virtualDocumentUri,
        virtualPosition,
        context.triggerCharacter
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

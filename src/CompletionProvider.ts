import { CompletionContext, CompletionList, CompletionItemProvider, Position, TextDocument, commands, Uri } from 'vscode'
import { findNode } from './astUtil.js'
import { VirtualDocument } from './virtualDocument.js'
import { createTempDocument, createTempPosition } from './tmpDocument.js'


export class MarkdownCompletionItem implements CompletionItemProvider {

  virtualDocument: VirtualDocument | (TextDocument & {position?: Position, update?: Function})
  
  constructor(virtualDocument:VirtualDocument | (TextDocument & {position: Position, update?: Function})) {
    this.virtualDocument = virtualDocument
  }

  async provideCompletionItems(document: TextDocument, position: Position, _: any, context: CompletionContext) {
    const node = findNode(document.getText(), position)
    if (!node) {
      return
    }

    let itemList


    // START - Using temporary document
    // const virtualDocument = await createTempDocument(document, node)
    // const virtualPosition = createTempPosition(position, node)
    // const vdocUri = virtualDocument?.uri
    // END -  Using temporary document

    // START - Using virtual document
    this.virtualDocument.update!(document, node, position)
    
    const vdocUri = this.virtualDocument.uri
    const virtualPosition = this.virtualDocument.position
    // END - Using virtual document

    if (!vdocUri || !virtualPosition) {
      return
    }

    try {
      itemList = await commands.executeCommand<CompletionList>(
        'vscode.executeCompletionItemProvider',
        vdocUri,
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
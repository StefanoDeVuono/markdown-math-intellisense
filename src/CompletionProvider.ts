import * as vscode from 'vscode'
import {
  createConnection,
  InitializeParams,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node'

import { CompletionContext, CompletionList, CompletionItemProvider, Position, TextDocument, commands, Uri } from 'vscode'
import { findNode } from './astUtil.js'
import { VirtualDocument } from './virtualDocument.js'
import { createTempDocument, createTempPosition } from './tmpDocument.js'
import { TextDocument as Text } from 'vscode-languageserver-textdocument'


export class MarkdownCompletionItem implements CompletionItemProvider {

  // virtualDocument: VirtualDocument | (TextDocument & {position?: Position, update?: Function})
  virtualDocument: VirtualDocument
  
  // constructor(virtualDocument:VirtualDocument | (TextDocument & {position: Position, update?: Function})) {
  constructor(virtualDocument:VirtualDocument) {
    this.virtualDocument = virtualDocument
  }

  async provideCompletionItems(document: TextDocument, position: Position, _: any, context: CompletionContext) {
    const node = findNode(document.getText(), position)
    if (!node) {
      return
    }

    let itemList

    /**  START - Using Temporary Document */
    // const virtualDocument = await createTempDocument(document, node) // languageId = 'latex'
    // const virtualPosition = createTempPosition(position, node)
    // const vdocUri = virtualDocument?.uri
    /** END -  Using Temporary Document */

    /** START - Using Virtual Document */

    this.virtualDocument.update!(document, node, position)
    
    const vdocUri = this.virtualDocument.uri
    const virtualPosition = this.virtualDocument.position
    const content = this.virtualDocument.get(document.uri.toString()) || ''
    const text = Text.create(vdocUri!.toString(), 'latex', 1, content)
    /** END - Using Virtual Document */

    const languages = await vscode.languages.getLanguages()
    console.log('languages', languages)
    if (!vdocUri || !virtualPosition) {
      return
    }

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
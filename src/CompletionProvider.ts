import { CompletionContext, CompletionList, CompletionItemProvider, Position, TextDocument, commands, Uri } from 'vscode'
import { findNode } from './astUtil.js'
import { VirtualDocument } from './virtualDocument.js'


export class MarkdownCompletionItem implements CompletionItemProvider {

    virtualDocument:VirtualDocument
    
    constructor(virtualDocument:VirtualDocument) {
        this.virtualDocument = virtualDocument
    }

    async provideCompletionItems(document: TextDocument, position: Position, _: any, context: CompletionContext) {
        const node = findNode(document.getText(), position)
        if (!node) {
            return
        }
        this.virtualDocument.update(document, node, position)
        const vdocUri = this.virtualDocument.uri
        const virtualPosition = this.virtualDocument.position
        if (!vdocUri || !virtualPosition) {
            return
        }
        let itemList

        // const tmpUri = Uri.file('/Users/stefanodevuono/Development/vscode-extensions/math-intellisense-markdown/tmp/derp.tex')
// _formatted ='file:///Users/stefanodevuono/Development/vscode-extensions/math-intellisense-markdown/tmp/derp.tex'
// _fsPath =null
// authority =''
// fragment =''
// fsPath ='/Users/stefanodevuono/Development/vscode-extensions/math-intellisense-markdown/tmp/derp.tex'
// path ='/Users/stefanodevuono/Development/vscode-extensions/math-intellisense-markdown/tmp/derp.tex'
// query =''
// scheme ='file'
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
            item.textEdit = undefined
        }
        return itemList
    }
}
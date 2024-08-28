import { CompletionContext, CompletionItemProvider, Position, TextDocument as VSCodeTextDocument } from 'vscode'
import { parseDocumentForLatex } from './astUtil.js'

export class MarkdownMathCompletionItemProvider implements CompletionItemProvider {
  completion: any

  constructor(completion: any) {
    this.completion = completion
  }

  async provideCompletionItems(document: VSCodeTextDocument, position: Position, _: any, context: CompletionContext) {
    const range = parseDocumentForLatex(document, position)
    
    if (!range || !range.contains(position)) return

    const provider = context.triggerCharacter === '@' ? this.completion.atProvider : this.completion.provider
    const itemList = provider.provideCompletionItems(document,position)

    if (!itemList) return

    return itemList
  }
}

import { CancellationToken, CompletionContext, CompletionItem, commands, CompletionItemProvider, Position, ProviderResult, TextDocument, CompletionList } from 'vscode'
import { parseDocumentForLatex } from './util.js'

type Completion = {
  provider: CompletionItemProvider,
  atProvider: CompletionItemProvider,
}

export class MarkdownMathCompletionItemProvider implements CompletionItemProvider {
  completion: Completion
  provider: CompletionItemProvider | undefined

  constructor(completion: Completion) {
    this.completion = completion
  }

  async provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
    const range = parseDocumentForLatex(document, position)

    if (!range || !range.contains(position)) return

    this.provider = context.triggerCharacter === '@' ? this.completion.atProvider : this.completion.provider
    const itemList = this.provider.provideCompletionItems(document, position, token, context)

    if (!itemList) return

    return itemList
  }
  resolveCompletionItem(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
    if (!this.provider) return item
    return this.provider!.resolveCompletionItem!(item, token)
  }
}

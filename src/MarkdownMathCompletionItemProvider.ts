import { CancellationToken, CompletionContext, CompletionItemProvider, CompletionList, Position, TextDocument, TextDocument as VSCodeTextDocument } from 'vscode'
import { parseDocumentForLatex } from './astUtil.js'

type LatexCompletionProvider = {
  provideCompletionItems(document: TextDocument, position: Position): CompletionList;
}

type Completion = {
  provider: LatexCompletionProvider,
  atProvider: LatexCompletionProvider,
}

export class MarkdownMathCompletionItemProvider implements CompletionItemProvider {
  completion: Completion

  constructor(completion: Completion) {
    this.completion = completion
  }

  async provideCompletionItems(document: VSCodeTextDocument, position: Position, _: CancellationToken, context: CompletionContext) {
    const range = parseDocumentForLatex(document, position)

    if (!range || !range.contains(position)) return

    const provider = context.triggerCharacter === '@' ? this.completion.atProvider : this.completion.provider
    const itemList = provider.provideCompletionItems(document, position)

    if (!itemList) return

    return itemList
  }
}

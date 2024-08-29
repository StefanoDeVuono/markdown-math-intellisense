import { CancellationToken, commands, CompletionContext, CompletionItemProvider, CompletionList, Position, TextDocument } from 'vscode'
import { parseDocumentForLatex } from './util.js'

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

  async provideCompletionItems(document: TextDocument, position: Position, _: CancellationToken, context: CompletionContext) {
    const range = parseDocumentForLatex(document, position)

    if (!range || !range.contains(position)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return commands.executeCommand('vscode.executeCompletionItemProvider', document.uri, position, context.triggerCharacter) as Promise<CompletionList>
    }

    const provider = context.triggerCharacter === '@' ? this.completion.atProvider : this.completion.provider
    const itemList = provider.provideCompletionItems(document, position)

    if (!itemList) return

    return itemList
  }
}

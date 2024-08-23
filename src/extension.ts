import * as vscode from 'vscode'
import { MarkdownCompletionItem } from './CompletionProvider.js'
import { VirtualDocument } from './virtualDocument.js'

export function activate(context: vscode.ExtensionContext) {
  const atSuggestionLatexTrigger = vscode.workspace.getConfiguration('latex-workshop').get('intellisense.atSuggestion.trigger.latex') as string

  const completionTrigger = ['\\', '.', ':', atSuggestionLatexTrigger]

  const virtualDocument = new VirtualDocument()

  // Register the virtual document provider
  vscode.workspace.registerTextDocumentContentProvider(VirtualDocument.scheme, {
    provideTextDocumentContent: (uri) => {
      // Remove leading `/` and ending `.tex` to get original URI
      const originalUri = uri.path.slice(1, -4)
      let decodedUri = decodeURIComponent(originalUri)
      return virtualDocument.get(decodedUri)
    }
  })

  // Register the completion provider
  // context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('markdown',
      new MarkdownCompletionItem(virtualDocument),
      ...completionTrigger
    )
  // )
}

// This method is called when extension is deactivated
export function deactivate() {}

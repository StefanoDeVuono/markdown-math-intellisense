import path from 'path'
import * as vscode from 'vscode'
import { MarkdownMathCompletionItemProvider } from './completion.js'

let registeredCompletionItemProvider: vscode.Disposable | undefined
export function activate(context: vscode.ExtensionContext) {
  const atSuggestionLatexTrigger = vscode.workspace.getConfiguration('latex-workshop').get('intellisense.atSuggestion.trigger.latex') as string

  const completionTrigger = ['\\', '.', ':', atSuggestionLatexTrigger]

  // Register the completion provider
  const LatexWorkshop = vscode.extensions.getExtension('James-Yu.LaTeX-Workshop')
  const LatexWorkshopPath = LatexWorkshop?.extensionUri.path
  const LatexWorkshopFullPath = path.join(LatexWorkshopPath!, 'out/src/lw.js')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { lw } = require(LatexWorkshopFullPath)
  const completion = lw.completion

  registeredCompletionItemProvider = vscode.languages.registerCompletionItemProvider('markdown',
    new MarkdownMathCompletionItemProvider(completion),
    ...completionTrigger,
  )

  console.log('Extension "my-extension" is now active!');

  // Check if snippets are loaded
  const snippets = vscode.workspace.getConfiguration('editor.snippetSuggestions');
  console.log('Snippet Suggestions Configuration:', snippets);

  // You can also log the snippets directly if you have access to them
  // This is just an example; you may need to adjust based on your setup
  console.log('Snippets loaded:', context.subscriptions);

}

// This method is called when extension is deactivated
export function deactivate() {
  registeredCompletionItemProvider?.dispose()
}

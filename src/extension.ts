import path from 'node:path'
import * as vscode from 'vscode'
import { MarkdownMathCompletionItemProvider } from './completion.js'

export function activate(context: vscode.ExtensionContext) {
  const atSuggestionLatexTrigger = vscode.workspace.getConfiguration('latex-workshop').get('intellisense.atSuggestion.trigger.latex') as string

  const completionTrigger = ['\\', '.', ':', atSuggestionLatexTrigger]

  // Register the completion provider
  const LatexWorkshop = vscode.extensions.getExtension('James-Yu.LaTeX-Workshop')
  const LatexWorkshopPath = LatexWorkshop?.extensionUri.path
  if (!LatexWorkshopPath) { // error if the dependency 'James-Yu.LaTeX-Workshop' is not found
    console.error('LaTeX Workshop extension not found. Please install it to use markdown-math-intellisense features.')
    return
  }
  const LatexWorkshopFullPath = path.join(LatexWorkshopPath!, 'out/src/lw.js')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { lw } = require(LatexWorkshopFullPath)
  const completion = lw.completion

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('markdown',
      new MarkdownMathCompletionItemProvider(completion),
      ...completionTrigger,
    ),
  )

  console.debug('Extension "markdown-math-intellisense" is now active!')

  // Check if snippets are loaded
  const snippets = vscode.workspace.getConfiguration('editor.snippetSuggestions')
  console.debug('Snippet Suggestions Configuration:', snippets)

  // You can also log the snippets directly if you have access to them
  // This is just an example; you may need to adjust based on your setup
  console.debug('Snippets loaded:', context.subscriptions)

}

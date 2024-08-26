import * as vscode from 'vscode'
import { MarkdownCompletionItem } from './CompletionProvider.js'
import path from 'path'

export function activate(context: vscode.ExtensionContext) {
  const atSuggestionLatexTrigger = vscode.workspace.getConfiguration('latex-workshop').get('intellisense.atSuggestion.trigger.latex') as string

  const completionTrigger = ['\\', '.', ':', atSuggestionLatexTrigger]

  // Register the completion provider
  const LatexWorkshop = vscode.extensions.getExtension('James-Yu.LaTeX-Workshop')
  const LatexWorkshopPath = LatexWorkshop?.extensionUri.path
  const LatexWorkshopFullPath = path.join(LatexWorkshopPath!, 'out/src/lw.js')
  import(LatexWorkshopFullPath).then(({lw})=> {
    const completion = lw.completion

    vscode.languages.registerCompletionItemProvider('markdown',
      new MarkdownCompletionItem(completion),
      ...completionTrigger
    )
  })
    
}

// This method is called when extension is deactivated
export function deactivate() {}

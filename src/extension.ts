import * as vscode from 'vscode'
import { MarkdownCompletionItem } from './CompletionProvider.js'
import { VirtualDocument } from './virtualDocument.js';

export function activate(context: vscode.ExtensionContext) {
  const atSuggestionLatexTrigger = vscode.workspace.getConfiguration('latex-workshop').get('intellisense.atSuggestion.trigger.latex') as string
  const completionTrigger = ["\\", ".", ":", atSuggestionLatexTrigger]

  const virtualDocument = new VirtualDocument();
  const latexWorkshop = vscode.extensions.getExtension('James-Yu.latex-workshop') as vscode.Extension<any> |any;
  
  (async ()=>{
    const commands = await vscode.commands.getCommands()
    console.log('commands', commands)
  //   const ext = await latexWorkshop.#e.getExtension()
  })()

  // look into workspace.textDocuments
  // vscode.languages.setLanguageConfiguration
  // vscode.languages.setTextDocumentLanguage

  
  // latexWorkshop.extensionPath
  // latexWorkshop.#e.R.get
  vscode.workspace.registerTextDocumentContentProvider('embedded-content', {
    provideTextDocumentContent: uri => {
      // Remove leading `/` and ending `.tex` to get original URI
      const originalUri = uri.path.slice(1, -4);
      let decodedUri = decodeURIComponent(originalUri);
      return virtualDocument.get(decodedUri);
    }
  });

  // COMPLETIONS
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'markdown' },
      new MarkdownCompletionItem(virtualDocument),
      ...completionTrigger
    )
  )
}

// This method is called when your extension is deactivated
export function deactivate() { }
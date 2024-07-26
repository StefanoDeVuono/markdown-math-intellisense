// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { MarkdownCompletionItem } from './CompletionProvider.js'
import { VirtualDocument } from './virtualDocument.js';
import path from 'path';


const latexExtensionName = 'James-Yu.LaTeX-Workshop'
const latexExtension = vscode.extensions.getExtension(latexExtensionName)

const markdownMathExtensionName = 'vscode.markdown-math'
const markdownMathExtension = vscode.extensions.getExtension(markdownMathExtensionName)

console.log('ext', latexExtension, markdownMathExtension)
console.log('ext loaded?')


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // const configuration = vscode.workspace.getConfiguration('math-intellisense-markdown')
  // const completionTrigger = configuration.get('completionTriggerCharacters') as string[]
  // const atSuggestionLatexTrigger = vscode.workspace.getConfiguration('latex-workshop').get('intellisense.atSuggestion.trigger.latex') as string
  // const completionTrigger = ["\\", ".", ":", atSuggestionLatexTrigger]
  const completionTrigger = ["\\", ".", ":"]

// editor.suggest.snippetsPreventQuickSuggestions
// latex-workshop.intellisense.atSuggestion.trigger.latex 

  let selectah: vscode.DocumentSelector = {
    scheme: "file",
    language: "markdown-math"
  }

  const virtualDocument = new VirtualDocument();

  // vscode.workspace.registerTextDocumentContentProvider('embedded-content', {
  //   provideTextDocumentContent: uri => {
  //     // Remove leading `/` and ending `.css` to get original URI
  //     const originalUri = uri.path.slice(1, -3)
  //     const { name } = path.parse(uri.path)
  //     const decodedUri = decodeURIComponent(name)
  //     return virtualDocument.get(decodedUri)
  //   }
  // });
    vscode.workspace.registerTextDocumentContentProvider('embedded-content', {
      provideTextDocumentContent: uri => {
        // Remove leading `/` and ending `.tex` to get original URI
        const originalUri = uri.path.slice(1, -4);
        const decodedUri = decodeURIComponent(originalUri);
        return virtualDocument.get(decodedUri);
      }
    });


  // HOVERS
  // context.subscriptions.push(
  //     vscode.languages.registerHoverProvider(
  //         selectah,
  //         new MarkdownHoverProvider()
  //     )
  // )

  // COMPLETIONS
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { scheme: 'file', language: 'markdown' },
      new MarkdownCompletionItem(virtualDocument),
      ...completionTrigger
    )
  )
  // console.log('latexExtension', latexExtension)
  // console.log('AtProvider', AtProvider)
  // console.log('otay')


  // AT Shortcuts
  // const latexDoctexSelector = ['latex', 'latex-expl3', 'pweave', 'jlweave', 'rsweave', 'doctex'].map(id =>  ({ scheme: 'file', language: id }) )
  // let atSuggestionDisposable: vscode.Disposable | undefined
  // const registerAtSuggestion = () => {
  //   
  //   if (atSuggestionLatexTrigger !== '') {
  //     // atProvider.updateTrigger()
  //     atSuggestionDisposable = vscode.languages.registerCompletionItemProvider(latexDoctexSelector, atProvider, atSuggestionLatexTrigger)
  //   }
  // }


  // context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
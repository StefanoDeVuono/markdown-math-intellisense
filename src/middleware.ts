// import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';


// let clientOptions: LanguageClientOptions = {
//   documentSelector: [{ scheme: 'file', language: 'html' }],
//   middleware: {
//     provideCompletionItem: async (document, position, context, token, next) => {
//       // If not in `<style>`, do not perform request forwarding
//       if (
//         !isInsideStyleRegion(
//           htmlLanguageService,
//           document.getText(),
//           document.offsetAt(position)
//         )
//       ) {
//         return await next(document, position, context, token);
//       }

//       const originalUri = document.uri.toString(true);
//       virtualDocumentContents.set(
//         originalUri,
//         getCSSVirtualContent(htmlLanguageService, document.getText())
//       );

//       const vdocUriString = `embedded-content://css/${encodeURIComponent(originalUri)}.css`;
//       const vdocUri = Uri.parse(vdocUriString);
//       return await commands.executeCommand<CompletionList>(
//         'vscode.executeCompletionItemProvider',
//         vdocUri,
//         position,
//         context.triggerCharacter
//       );
//     }
//   }
// };

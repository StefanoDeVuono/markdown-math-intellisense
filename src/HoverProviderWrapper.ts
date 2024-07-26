// import {Hover, HoverProvider, CompletionItemProvider, MarkdownString, Position, TextDocument, commands, CancellationToken, CompletionContext} from 'vscode'
// import {findNode, rangeOfNode} from './astUtil'
// // import {MathPreview} from './mathPreview'
// import {createVirtualDocument, createVirtualPosition} from './virtualDocument'


// // export class CompletionItemProviderWrapper implements CompletionItemProvider {
// //   provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {

// //   }
// // }

// export class HoverProviderWrapper implements HoverProvider {
//   preview: any

//   constructor(preview: any) {
//     this.preview = preview
//   }

//   // here we want to delegate hover to James Yu's latex plugin
//   async provideHover(document: TextDocument, position: Position) {
//     const node = findNode(document.getText(), position)
//     if (!node) {
//         return
//     }
//     if (node.type == 'inlineMath' || node.type == 'math') {
//         if (!node.value) {
//             return
//         }
//         const tex = node.type === 'inlineMath' ? node.value : '\\begin{equation}' + node.value + '\\end{equation}'
//         const dataurl = await this?.preview?.renderToSvgDataUrl(tex)
//         const md = new MarkdownString( `![equation](${dataurl})` )
//         const range = rangeOfNode(node)
//         return new Hover(md, range)
//     }
//     const virtualDoc = await createVirtualDocument(document, node)
//     const virtualPosition = createVirtualPosition(position, node)
//     if (!virtualDoc || !virtualPosition) {
//         return
//     }
//     const hovers = await commands.executeCommand<Hover[]>('vscode.executeHoverProvider', virtualDoc.uri, virtualPosition)
//     if (!hovers) {
//         return
//     }
//     return hovers[0]
// }


// }

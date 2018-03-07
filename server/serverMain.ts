import {
  IPCMessageReader,
  IPCMessageWriter,
  createConnection,
  IConnection,
  TextDocuments,
  InitializeResult,
  TextDocumentPositionParams,
  CompletionItem,
  CompletionItemKind,
  TextDocumentSyncKind
} from 'vscode-languageserver'

const connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process))
const documents: TextDocuments = new TextDocuments()
documents.listen(connection)

connection.onInitialize((params): InitializeResult => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true
      }
    }
  }
})

documents.onDidChangeContent(change => {
  console.log('didChangeContent')
})

connection.onDidChangeWatchedFiles(change => {
  console.log('didChangeWatchedFiles')
})

connection.onCompletion((position: TextDocumentPositionParams): CompletionItem[] => {
  return [
    {
      label: 'TypeScript',
      kind: CompletionItemKind.Text,
      data: 1
    },
    {
      label: 'JavaScript',
      kind: CompletionItemKind.Text,
      data: 2
    }
  ]
})

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
  if (item.data === 1) {
    item.detail = 'TypeScript details'
    item.documentation = 'TypeScript documentation'
  } else if (item.data === 2) {
    item.detail = 'JavaScript details'
    item.documentation = 'JavaScript documentation'
  }
  return item
})

connection.onDidChangeTextDocument(params => {
  console.log(`${params.textDocument.uri} changeddd`)
  console.log(`${JSON.stringify(params.contentChanges, null, 2)}`)
})

connection.listen()

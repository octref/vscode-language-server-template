//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert'
import * as path from 'path'

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
import { createLanguageClient } from '../client/clientMain'
import { LanguageClient, Middleware, CompletionRequest } from 'vscode-languageclient'
import { CompletionList } from 'vscode-languageserver-types'
import { TextDocument, Position, CompletionContext, CancellationToken } from 'vscode';

// Defines a Mocha test suite to group tests of similar kind together

let client: LanguageClient
suite('Extension Tests', () => {
  const serverModule = path.resolve(__dirname, '../..')
  const middleware: Middleware = {
    didOpen(doc) {
      console.log(doc)
    },
    async provideCompletionItem(
      document: TextDocument,
      position: Position,
      // context: CompletionContext,
      // token: CancellationToken
    ) {
      const response = await client.sendRequest('textDocument/completion', {
        textDocument: document,
        position
      });
      return (response as CompletionList)
    }
  }
  client = createLanguageClient(serverModule, middleware)

  // Defines a Mocha unit test
  test('Test LSP', done => {
    client.onReady().then(() => {})

    client.start()
  })
})

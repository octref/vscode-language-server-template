// jest.mock('vscode')
// const vscode = require('vscode')

vscode.mockImplementation({})

import * as path from 'path'

import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient'

let client: LanguageClient;

beforeAll(() => {

  const serverModule = path.resolve(__dirname, '../server/dist/serverMain.js')
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6006'] }

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'markdown' }],
    synchronize: {
      configurationSection: []
    }
  }

  client = new LanguageClient('pls', 'Markdown Language Server', serverOptions, clientOptions)
})

test('Testing server launch', (done) => {
  client.onReady().then(() => {
    client.onNotification('textDocument/didOpen', params => {
      done()
    })
  })

  client.start()
})

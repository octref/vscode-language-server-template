import * as path from 'path'

import { ExtensionContext } from 'vscode'
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind, Middleware } from 'vscode-languageclient'

export function activate(context: ExtensionContext) {
  // const client = createLanguageClient(context.extensionPath, null)
  // const disposable = client.start()
  // context.subscriptions.push(disposable)
}

export function createLanguageClient(extensionPath: string, middleware: Middleware) {
  const serverModule = path.join(extensionPath, 'server', 'dist', 'serverMain.js')
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6006'] }

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'markdown' },
      { scheme: 'untitled', language: 'markdown' }
    ],
    synchronize: {
      configurationSection: []
    },
    middleware
  }

  return new LanguageClient('pls', 'Pine\'s Markdown Language Server', serverOptions, clientOptions)
}
import * as path from 'path'
import * as vscode from 'vscode'
import * as WebSocket from 'ws'

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient'

export function activate(context: vscode.ExtensionContext) {
  const serverModule = context.asAbsolutePath(path.join('server', 'dist', 'serverMain.js'))
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6006'] }

  const config = vscode.workspace.getConfiguration('mls.debug.log')
  let socket: WebSocket = undefined;
  if (config) {
    if (config.output === 'websocket' && config.port) {
      socket = new WebSocket(`ws://localhost:${config.get('port')}`)
    }
  }

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'markdown' },
      { scheme: 'untitled', language: 'markdown' }
    ],
    synchronize: {
      configurationSection: []
    },
    outputChannel: socket ? socketToChannel(socket) : undefined
  }

  const client = new LanguageClient('mls', 'Markdown Language Server', serverOptions, clientOptions)

  const disposable = client.start()
  context.subscriptions.push(disposable)
}

const socketToChannel = (socket: WebSocket): vscode.OutputChannel => {
  return {
    name: 'websocket',
    append(value: string) {
      socket.send(value)
    },
    appendLine(value: string) {
      socket.send(value)
    },
    clear() {},
    show() {},
    hide() {},
    dispose() {}
  }
}

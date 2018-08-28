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
  let socket: WebSocket | null = null
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

let log = ''
const socketToChannel = (socket: WebSocket): vscode.OutputChannel => {
  return {
    name: 'websocket',
    append(value: string) {
      log += value
    },
    appendLine(value: string) {
      log += value
      socket.send(log)
      log = ''
    },
    clear() {},
    show() {},
    hide() {},
    dispose() {}
  }
}

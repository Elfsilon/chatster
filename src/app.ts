import { HttpAppServer } from './app/http_server'
import { SignallingNamespace } from './app/namespaces/signalling_namespace'
import { NamespaceFactory, WebSocketAppServer } from './app/ws_server'

export class App {
  private httpServer: HttpAppServer
  private wsServer: WebSocketAppServer

  constructor() {
    this.httpServer = new HttpAppServer()

    const factories: NamespaceFactory[] = [(s) => new SignallingNamespace(s)]
    this.wsServer = new WebSocketAppServer(this.httpServer.server, factories)
  }

  run() {
    this.httpServer.listen()
  }
}

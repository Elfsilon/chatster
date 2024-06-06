import { ExpressServer } from './app/express_server'
import { HttpAppServer } from './app/http_server'
import { SignallingNamespace } from './app/namespaces/signalling_namespace'
import { NamespaceFactory, WebSocketAppServer } from './app/ws_server'

export class App {
  private express: ExpressServer
  private httpServer: HttpAppServer
  private wsServer: WebSocketAppServer

  constructor() {
    this.express = new ExpressServer()
    this.httpServer = new HttpAppServer(this.express)

    const factories: NamespaceFactory[] = [(s) => new SignallingNamespace(s)]
    this.wsServer = new WebSocketAppServer(this.httpServer.server, factories)
  }

  run() {
    this.httpServer.listen()
  }
}

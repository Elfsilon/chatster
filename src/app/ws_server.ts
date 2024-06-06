import { Server as HTTPServer } from 'http'
import { ServerOptions, Server, Socket, Namespace } from 'socket.io'
import { SocketNamespace } from './namespaces/socket_namespace'

export type NamespaceFactory = (a: Server) => SocketNamespace

export class WebSocketAppServer {
  private io: Server
  private namespaces: SocketNamespace[] = []

  constructor(server: HTTPServer, namespaceFactories?: NamespaceFactory[]) {
    const configuration = this.getConfiguration()
    this.io = new Server(server, configuration)

    if (namespaceFactories) {
      for (const factory of namespaceFactories) {
        const namespace = factory(this.io)
        this.namespaces.push(namespace)
      }
    }

    this.registerServerHandlers()
  }

  private getConfiguration(): Partial<ServerOptions> {
    return {
      cors: { origin: '*' },
    }
  }

  private registerSocketHandlers(socket: Socket) {
    socket.on('disconnect', () => {})
  }

  private registerServerHandlers() {
    this.io.on('connect', this.registerSocketHandlers)
  }
}

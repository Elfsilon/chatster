import { DisconnectReason, Namespace, Server, Socket } from 'socket.io'

export abstract class SocketNamespace {
  protected namespace: Namespace

  constructor(server: Server, namespaceName: string) {
    this.namespace = server.of(namespaceName)
    this.namespace.on('connect', (socket) => {
      this.onConnect(socket)
      this.registerHandlers(socket)

      socket.on('disconnect', (reason, description) => {
        this.onDisconnect(socket, reason, description)
      })
    })
  }

  abstract onConnect(socket: Socket): void
  abstract onDisconnect(socket: Socket, reason: DisconnectReason, description?: any): void
  abstract registerHandlers(socket: Socket): void
}

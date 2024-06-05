import { Server as HTTPServer } from 'http'
import { ServerOptions, Server, Socket, Namespace } from 'socket.io'
import { SocketNamespace } from './namespaces/socket_namespace'

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
export type AppSocketNamespace = Namespace<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

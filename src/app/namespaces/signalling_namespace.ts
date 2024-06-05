import { Server } from 'socket.io'
import { SocketNamespace } from './socket_namespace'
import { SignallingSocket } from './signalling_namespace.types'

const SIGNALLING_SERVER_NAMESPACE = '/signalling'
const MAX_PEER_COUNT = 2

export class SignallingNamespace extends SocketNamespace {
  private callerID: string | null = null
  private peersCount = 0

  constructor(server: Server) {
    super(server, SIGNALLING_SERVER_NAMESPACE)
  }

  onConnect(socket: SignallingSocket): void {
    if (this.peersCount === MAX_PEER_COUNT) {
      socket.emit('server-permission', false, 'Too many active peers')
      socket.disconnect(true)
      console.log(`Socket #${socket.id} has been kicked: too many active peers`)
      return
    }

    socket.emit('server-permission', true, 'OK')
    console.log(`Socket #${socket.id} has been connected`)
    if (this.callerID == null) {
      this.callerID = socket.id
    }
    this.peersCount += 1
  }

  onDisconnect(socket: SignallingSocket): void {
    console.log(`Socket #${socket.id} has been disconnected`)
    this.callerID = null
    this.peersCount -= 1
    socket.broadcast.emit('other-peer-disconnected')
  }

  registerHandlers(socket: SignallingSocket): void {
    socket.on('get-my-role', () => this.onGetMyRole(socket))
    socket.on('ready', () => this.onCalleeReady(socket))
    socket.on('offer-from-client', (offer) => this.onOfferFromCaller(socket, offer))
    socket.on('answer-from-client', (answer) => this.onAnswerFromCallee(socket, answer))
    socket.on('ice-candidate-from-client', (candidate) => this.onIceCandidate(socket, candidate))
  }

  onGetMyRole(socket: SignallingSocket) {
    const role = socket.id === this.callerID ? 'caller' : 'callee'
    // console.log('get my role => ', role)
    socket.emit('your-role-is', role)
  }

  onCalleeReady(socket: SignallingSocket) {
    // console.log(`Socket ${socket.id} is ready`)
    socket.broadcast.emit('other-peer-ready')
  }

  onOfferFromCaller(socket: SignallingSocket, offer: RTCSessionDescriptionInit) {
    // console.log(`Got offer from ${socket.id}`)
    socket.broadcast.emit('offer-from-other-peer', offer)
  }

  onAnswerFromCallee(socket: SignallingSocket, answer: RTCSessionDescriptionInit) {
    // console.log(`Got answer from ${socket.id}`)
    socket.broadcast.emit('answer-from-other-peer', answer)
  }

  onIceCandidate(socket: SignallingSocket, candidate: RTCIceCandidate) {
    // console.log(`Got ICE candidate from ${socket.id}`)
    socket.broadcast.emit('ice-candidate-from-other-peer', candidate)
  }
}

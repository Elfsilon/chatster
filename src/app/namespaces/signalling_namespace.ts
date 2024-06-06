import { Server } from 'socket.io'
import { SocketNamespace } from './socket_namespace'
import { SignallingSocket } from './signalling_namespace.types'
import { JWTManager } from '../access_token_manager/jwt_manager'

const SIGNALLING_SERVER_NAMESPACE = '/signalling'
const MAX_PEER_COUNT = 2

type RoomInfo = {
  callerID: string | null
  peersCount: number
}

type RoomsInfo = {
  [key: string]: RoomInfo
}

export class SignallingNamespace extends SocketNamespace {
  private roomsInfo: RoomsInfo = {}
  // TODO: refactor and provide DI
  private manager = new JWTManager('test-secret')

  constructor(server: Server) {
    super(server, SIGNALLING_SERVER_NAMESPACE)
  }

  onConnect(socket: SignallingSocket): void {
    const token = socket.handshake.auth.token

    try {
      this.manager.verifyToken(token)
    } catch (err) {
      socket.emit('server-permission', false, `Unauthorized: ${err}`)
      socket.disconnect(true)
      console.log(`Socket #${socket.id} has been kicked: unauthorized`)
    }

    const info = this.roomsInfo[token]
    const maxPeerReached = info && info.peersCount === MAX_PEER_COUNT

    if (maxPeerReached) {
      socket.emit('server-permission', false, 'Too many active peers')
      socket.disconnect(true)
      console.log(`Socket #${socket.id} has been kicked: too many active peers`)
      return
    }

    if (!info) {
      this.roomsInfo[token] = {
        callerID: socket.id,
        peersCount: 1,
      }
    } else {
      this.roomsInfo[token].peersCount += 1
    }

    socket.join(token)
    socket.emit('server-permission', true, 'OK')
    console.log(`Socket #${socket.id} has been connected`)
  }

  onDisconnect(socket: SignallingSocket): void {
    console.log(`Socket #${socket.id} has been disconnected`)
    const token = socket.handshake.auth.token

    if (this.roomsInfo[token].peersCount === 1) {
      delete this.roomsInfo[token]
    } else {
      this.roomsInfo[token].callerID = null
      this.roomsInfo[token].peersCount -= 1
    }
    socket.to(token).emit('other-peer-disconnected')
  }

  registerHandlers(socket: SignallingSocket): void {
    socket.on('get-my-role', () => this.onGetMyRole(socket))
    socket.on('ready', () => this.onCalleeReady(socket))
    socket.on('offer-from-client', (offer) => this.onOfferFromCaller(socket, offer))
    socket.on('answer-from-client', (answer) => this.onAnswerFromCallee(socket, answer))
    socket.on('ice-candidate-from-client', (candidate) => this.onIceCandidate(socket, candidate))
  }

  onGetMyRole(socket: SignallingSocket) {
    const token = socket.handshake.auth.token
    const roomCallerID = this.roomsInfo[token].callerID
    const role = socket.id === roomCallerID ? 'caller' : 'callee'
    // console.log('get my role => ', role)
    socket.emit('your-role-is', role)
  }

  onCalleeReady(socket: SignallingSocket) {
    // console.log(`Socket ${socket.id} is ready`)
    socket.to(socket.handshake.auth.token).emit('other-peer-ready')
  }

  onOfferFromCaller(socket: SignallingSocket, offer: RTCSessionDescriptionInit) {
    // console.log(`Got offer from ${socket.id}`)
    socket.to(socket.handshake.auth.token).emit('offer-from-other-peer', offer)
  }

  onAnswerFromCallee(socket: SignallingSocket, answer: RTCSessionDescriptionInit) {
    // console.log(`Got answer from ${socket.id}`)
    socket.to(socket.handshake.auth.token).emit('answer-from-other-peer', answer)
  }

  onIceCandidate(socket: SignallingSocket, candidate: RTCIceCandidate) {
    // console.log(`Got ICE candidate from ${socket.id}`)
    socket.to(socket.handshake.auth.token).emit('ice-candidate-from-other-peer', candidate)
  }
}

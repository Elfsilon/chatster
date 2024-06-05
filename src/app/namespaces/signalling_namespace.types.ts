import { Socket } from 'socket.io'

export interface ServerToClientEvents {
  'your-role-is': (type: 'caller' | 'callee', offer?: RTCSessionDescriptionInit) => void
  'other-peer-ready': () => void
  'other-peer-disconnected': () => void
  'offer-from-other-peer': (answer: RTCSessionDescriptionInit) => void
  'answer-from-other-peer': (answer: RTCSessionDescriptionInit) => void
  'ice-candidate-from-other-peer': (candidate: RTCIceCandidate) => void
  'server-permission': (status: boolean, message: string) => void
}

export interface ClientToServerEvents {
  'get-my-role': () => void
  ready: () => void
  'offer-from-client': (offer: RTCSessionDescriptionInit) => void
  'answer-from-client': (answer: RTCSessionDescriptionInit) => void
  'ice-candidate-from-client': (candidate: RTCIceCandidate) => void
}

export interface InterServerEvents {}

export interface SocketData {
  name: string
}

export type SignallingSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

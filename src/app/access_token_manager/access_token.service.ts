import { ChatType, JWTManager } from './jwt_manager'

export class P2PService {
  constructor(private jwtManager: JWTManager) {}

  getConnectionToken(chatName: string): string {
    return this.jwtManager.generateConnectionToken(ChatType.P2P)
  }

  // join(link: InviteLink) {}

  // generateInviteLink(url: string, token: string) {
  //   this.jwtManager.verifyToken(token)
  //   return `${url}/chat/${token}`
  // }

  // destroy() {}

  // private validate() {}
}

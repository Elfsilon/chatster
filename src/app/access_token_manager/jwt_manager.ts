import { sign, verify } from 'jsonwebtoken'

type JWTManagerOptions = {
  accessTokenTTL: number | string
}

type ConnectionTokenPayload = {
  seed: number
  type: ChatType
}

export const DefaultOptions: JWTManagerOptions = {
  accessTokenTTL: '15m',
}

export enum ChatType {
  P2P = 'P2P',
  Group = 'Group',
}

export class JWTManager {
  constructor(private secret: string, private options: JWTManagerOptions = DefaultOptions) {}

  generateConnectionToken(type: ChatType): string {
    const payload: ConnectionTokenPayload = {
      seed: Math.floor(Math.random() * 10000),
      type: type,
    }
    const token = sign(payload, this.secret, {
      expiresIn: this.options.accessTokenTTL,
    })

    return token
  }

  verifyToken(token: string): void {
    verify(token, this.secret)
  }
  // const payload: AccessTokenPayload = {
  //   seed: Math.floor(Math.random() * 10000),
  //   type: type,
  // }
  // const token = sign(payload, this.secret, {
  //   expiresIn: this.options.accessTokenTTL,
  // })

  //   return token
  // }
}

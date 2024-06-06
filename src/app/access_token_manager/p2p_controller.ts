import { Request, Response } from 'express'
import { P2PService } from './access_token.service'

type GetAccessTokenBody = {
  name: string
}

export class P2PController {
  constructor(private service: P2PService) {}

  getConnectionToken(req: Request, res: Response) {
    const { name }: GetAccessTokenBody = req.body

    const token = this.service.getConnectionToken(name)

    res.json({
      token: token,
    })
  }

  // TODO: remove - client's responsibility
  // getInviteLink(req: Request, res: Response) {
  //   const { token }: GetInviteLinkBody = req.body
  //   const host = req.hostname
  //   console.log(req.url)

  //   try {
  //     const link = this.service.generateInviteLink(host, token)
  //     res.json({ link: link })
  //   } catch (err) {
  //     res.status(400).json({
  //       message: 'invalid token',
  //       error: err,
  //     })
  //   }
  // }
}

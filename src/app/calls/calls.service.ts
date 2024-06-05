// https://chatster.com/${token}
// Token:
// - id
// - chat_id
// - chat_type: call | meet

export class CallsService {
  create(name: string): InviteLink {}

  join(link: InviteLink) {}

  generateInviteLink() {}

  destroy() {}

  private validate() {}
}

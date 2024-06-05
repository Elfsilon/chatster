import { createServer, Server as HttpServer } from 'http'

const DEFAULT_PORT = 3000

export class HttpAppServer {
  private httpServer: HttpServer

  public get server(): HttpServer {
    return this.httpServer
  }

  constructor() {
    this.httpServer = createServer()
    this.registerHttpEventHandlers()
  }

  private getReadableAddress(): string {
    const address = this.httpServer.address()
    if (address === null) {
      return 'null'
    }

    if (typeof address === 'string') {
      return address
    }

    const host = address.address === '::' ? 'localhost' : address.address
    return `${host}:${address.port}`
  }

  private registerHttpEventHandlers() {
    this.httpServer.on('listening', () => {
      console.log(`Listening on ${this.getReadableAddress()}`)
    })

    this.httpServer.on('close', () => {
      console.log(`Server shutdown}`)
    })
  }

  listen() {
    this.httpServer.listen(DEFAULT_PORT)
  }
}

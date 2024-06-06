import { createServer, Server as HttpServer } from 'http'
import { ExpressServer } from './express_server'

const DEFAULT_PORT = 3000

export class HttpAppServer {
  private httpServer: HttpServer

  public get server(): HttpServer {
    return this.httpServer
  }

  constructor(app: ExpressServer) {
    this.httpServer = createServer(app.server)
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
    this.httpServer.listen(process.env.PORT || DEFAULT_PORT)
  }
}

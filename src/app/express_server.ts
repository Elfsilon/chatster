import express, { Express } from 'express'
import cors from 'cors'
import { DependencyManager } from './core/dependency_manager'
import { P2PController } from './access_token_manager/p2p_controller'
import { P2PService } from './access_token_manager/access_token.service'
import { JWTManager } from './access_token_manager/jwt_manager'

const DepKeys = {
  JWTManager: Symbol.for('jwt-manager'),
  P2PService: Symbol.for('p2p-service'),
  P2PController: Symbol.for('p2p-controller'),
}

export class ExpressServer {
  private app: Express
  private deps: DependencyManager

  get server(): Express {
    return this.app
  }

  constructor() {
    this.app = express()
    this.deps = new DependencyManager()

    this.configureApp()
    this.configureDeps()
    this.configureRoutes()
  }

  private configureApp() {
    this.app.use(
      cors({
        origin: '*',
      })
    )
    this.app.use(express.json())
  }

  private configureDeps() {
    const jwtSecret = 'test-secret'

    this.deps.register(DepKeys.JWTManager, () => new JWTManager(jwtSecret))
    this.deps.register(DepKeys.P2PService, (injector) => {
      const manager: JWTManager = injector.provide(DepKeys.JWTManager)
      return new P2PService(manager)
    })
    this.deps.register(DepKeys.P2PController, (injector) => {
      const service: P2PService = injector.provide(DepKeys.P2PService)
      return new P2PController(service)
    })
  }

  private configureRoutes() {
    const controller: P2PController = this.deps.provide(DepKeys.P2PController)
    const P2PRouter = express.Router()

    this.app.use('/p2p', P2PRouter)
    P2PRouter.get('/token', (req, res) => controller.getConnectionToken(req, res))
    // P2PRouter.get('/link', (req, res) => controller.getInviteLink(req, res))
  }
}

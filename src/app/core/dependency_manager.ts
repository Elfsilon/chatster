interface DependencyInjector {
  provide(key: Symbol): any
}

export type DependencyFactory = (injector: DependencyInjector) => any

export class DependencyManager {
  private dependencies = new Map<Symbol, any>()
  private lazyDependencies = new Map<Symbol, DependencyFactory>()

  register(key: Symbol, factory: DependencyFactory): void {
    if (this.dependencies.has(key) || this.lazyDependencies.has(key)) {
      throw Error('[DependencyManager] provided key is already registered')
    }
    this.lazyDependencies.set(key, factory)
  }

  provide(key: Symbol): any {
    if (this.dependencies.has(key)) {
      return this.dependencies.get(key)
    }

    if (this.lazyDependencies.has(key)) {
      const factory = this.lazyDependencies.get(key)!
      const dep = factory(this)

      this.lazyDependencies.delete(key)
      this.dependencies.set(key, dep)

      return dep
    }

    throw Error(`[DependencyManager] provided key was not found: ${key.description}`)
  }
}

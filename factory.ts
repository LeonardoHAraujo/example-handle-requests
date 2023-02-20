interface UseCaseStrategy<I, O> {
  execute(data?: I): O
  condition(data: UseCaseStrategy.Params): UseCaseStrategy.Result
}

namespace UseCaseStrategy {
  export type Params = { path: string, method: string }
  export type Result = boolean
}

class UseCaseA implements UseCaseStrategy<{ foo: string, opa: string }, void> {
  execute({ foo, opa }: { foo: string, opa: string }): void {
    console.log(`Executing UseCaseA: ${foo} and ${opa}`)
  }
  condition({ path, method }: UseCaseStrategy.Params): UseCaseStrategy.Result {
    return path === '/a/' && method === 'GET'
  }
}

class UseCaseB implements UseCaseStrategy<{ foo: string }, void> {
  execute({ foo }: { foo: string }): void {
    console.log(`Executing UseCaseB: ${foo}`)
  }
  condition({ path, method }: UseCaseStrategy.Params): UseCaseStrategy.Result {
    return path === '/b/' && method === 'GET'
  }
}

class UseCaseC implements UseCaseStrategy<{ name: string, age: number }, void> {
  execute({ name, age }: { name: string, age: number }): void {
    console.log(`Executing UseCaseC: I have ${name} and ${age}`)
  }
  condition({ path, method }: UseCaseStrategy.Params): UseCaseStrategy.Result {
    return path === '/c/' && method === 'GET'
  }
}

class UseCaseFactory {
  readonly useCases: UseCaseStrategy<Object, Object | void>[]

  constructor(...args: UseCaseStrategy<Object, Object | void>[]) {
    this.useCases = args
  }

  public getUseCase(path: string, method: string): UseCaseStrategy<Object, Object | void> {
    const usecase = this.useCases.find(useCase => useCase.condition({ path, method }))

    if (usecase === undefined) {
      throw new Error('Invalid parameters')
    }

    return usecase
  }
}

//injecting depedencies...
const factory = new UseCaseFactory(
  new UseCaseA(),
  new UseCaseB(),
  new UseCaseC()
)

factory.getUseCase('/a/', 'GET').execute({ foo: 'test', opa: 'foo' })
factory.getUseCase('/b/', 'GET').execute({ foo: 'test' })
factory.getUseCase('/c/', 'GET').execute({ name: 'leo', age: 25 })
// factory.getUseCase('/wrong/path', 'GET').execute('test')

interface UseCaseStrategy {
    execute(foo:String):void;
    condition(path:String, method:String):Boolean;
}

class UseCaseA implements UseCaseStrategy {
    execute(foo: String): void {
        console.log(`Executing UseCaseA: ${foo}`);
    }
    condition(path: String, method: String): Boolean {
        return path === "/a/" && method === "GET";
    }
}

class UseCaseB implements UseCaseStrategy {
    execute(foo: String): void {
        console.log(`Executing UseCaseB: ${foo}`);
    }
    condition(path: String, method: String): Boolean {
        return path === "/b/" && method === "GET";
    }
}

class UseCaseFactory {

    readonly useCases:UseCaseStrategy[];

    constructor(...args: UseCaseStrategy[]) {
       this.useCases = args
    }

    public getUseCase(path: String, method: String):UseCaseStrategy {
        var useCase = this.useCases.find(useCase => useCase.condition(path, method))
        if (useCase === undefined) {
            throw new Error('Invalid parameters');
          }
        return useCase;
    }
}

//injecting depedencies...
var factory = new UseCaseFactory(new UseCaseA(), new UseCaseB());

factory.getUseCase("/a/", "GET").execute("test")
factory.getUseCase("/b/", "GET").execute("test")
factory.getUseCase("/wrong/path", "GET").execute("test")

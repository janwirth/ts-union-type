export type Result<err, res> = Err<err> | Ok<res>;
type ResultType = Result["type"];

export class Err {
    type = "Err" as const;

    constructor(public err: err) {
    }
}

export class Ok {
    type = "Ok" as const;

    constructor(public res: res) {
    }
}

type ResultMap<U> = { [K in ResultType]: U extends { type: K } ? U : never };
type ResultTypeMap = ResultMap<Result>;
type Pattern<T> = { [K in keyof ResultTypeMap]: (union: ResultTypeMap[K]) => T };

export function match<T>(pattern: Pattern<T>): (result: Result) => T {
    return result => pattern[result.type](result as any)
}

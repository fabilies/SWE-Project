

interface PairType<T, U> {
    fst: T,
    snd: U
}

interface PairOperations<T, U> {
    map: <TResult, UResult>(this: Pair<T, U>, left: (_: T) => TResult, right: (_: U) => UResult) => Pair<TResult, UResult> // Map over both T & U lists
    mapLeft: <TResult>(this: Pair<T, U>, left: (_: T) => TResult) => Pair<TResult, U> // Map over left list T
    mapRight: <UResult>(this: Pair<T, U>, right: (_: U) => UResult) => Pair<T, UResult> // Map over right list U
}

let id = <T>() => {
    return (x: T) => x
} 

export type Pair<T, U> = PairType<T, U> & PairOperations<T, U>

export let Pair = <T, U>(first: T, second: U): Pair<T, U> => ({
    fst: first,
    snd: second,
    map: function <TResult, UResult>(this: Pair<T, U>, f: (_: T) => TResult, g: (_: U) => UResult): Pair<TResult, UResult>{
        return Pair(f(this.fst), g(this.snd))
    },
    mapLeft: function <TResult>(this: Pair<T, U>, left: (_: T) => TResult): Pair<TResult, U> {
        return this.map(
            left, id()
        )
    },
    mapRight: function  <UResult>(this: Pair<T, U>, right: (_: U) => UResult): Pair<T, UResult> {
        return this.map(
            id(), right
        )
    }
})

import { Pair } from "./Pair";
import { Func, Unit } from "./Func";

export type List<T> = ListType<T> & ListOperations<T>

type ListType<T> = {
    kind: "empty"
} | {
    kind: "cons"
    head: T
    tail: List<T>
}

type ListOperations<T> = {
    reduce: <U>(this: List<T>, f: (state: U, x: T) => U, accumulator: U) => U
    map: <U>(this: List<T>, f: (_: T) => U) => List<U>
    reverse: (this: List<T>) => List<T>
    concat: (this: List<T>, l: List<T>) => List<T>
    toArray: (this: List<T>) => T[]
    count: (this: List<T>) => number
    filter: (this: List<T>, predicate: Func<T, boolean>) => List<T>
    merge: <U>(this: List<T>, list: List<U>) => List<Pair<T, U>>
}

let ListOperations = <T>(): ListOperations<T> => ({
    reduce: function <U>(this: List<T>, f: (state: U, x: T) => U, accumulator: U): U {
        return this.kind == "empty" ? accumulator : this.tail.reduce(f, f(accumulator, this.head))
    },
    map: function <U>(this: List<T>, f: (_: T) => U): List<U> {
        return this.reduce<List<U>>((s, x) => Cons(f(x), s), Empty<U>()).reverse()
    },
    reverse: function (this: List<T>): List<T> {
        return this.reduce((s, x) => Cons(x, s), Empty())
    },
    concat: function (this: List<T>, l: List<T>): List<T> {
        return this.reverse().reduce((s, x) => Cons(x, s), l)
    },
    toArray: function (this: List<T>): T[] {
        return this.reduce<T[]>((s, x) => s.concat([x]), [])
    },
    count: function (this: List<T>): number {
        return this.reduce((s, x) => s + 1, 0)
    }, 
    filter: function (this: List<T>, predicate: Func<T, boolean>): List<T> {
        return this.reduce((s, x) => {
            if (predicate.f(x)) {
                return Cons(x, s)
            } else {
                return s
            }
        }, Empty())
    },
    merge: function <U>(this: List<T>, list: List<U>): List<Pair<T, U>> {
        if (this.count() != list.count()) {
            throw "Not equal in length"
        } else if (this.kind == "empty" && list.kind == "empty") {
            return Empty()
        } else if (this.kind == "cons" && list.kind == "cons") {
            return Cons(Pair(this.head, list.head), this.tail.merge(list.tail))
        } else {
            throw "Something went wrong"
        }
    }

})

export let Cons = <T>(head: T, tail: List<T>): List<T> => ({
    kind: "cons",
    head: head,
    tail: tail,
    ...ListOperations()
})

export let Empty = <T>(): List<T> => ({
    kind: "empty",
    ...ListOperations()
})

export let mergeListTypes = <T, U>(pairResult: List<Pair<T, U>>): List<T & U> => {
    return pairResult.map<T & U>(pr => ({ 
        ...pr.fst, 
        ...pr.snd
    }))
}

export let createList = (n: number): List<Unit> => {
    if(n <= 0) {
        return Empty()
    }
    else {
        return Cons({}, createList(n - 1))
    }
}

// list[] to List<T>
export let FromArrayToList = <T>(array: T[]): List<T> => {
    return array.reduce((s, x) => Cons(x, s) , Empty<T>())
}




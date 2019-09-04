import { Pair } from "./Pair";

export type List<T> = ListType<T> & ListOperations<T>

type Unit = {}

type ListType<T> = {
    kind: "empty"
} | {
    kind: "cons"
    head: T
    tail: List<T>
}

// To apply on student list
type ListOperations<T> = {
    map: <U>(this: List<T>, f: (_: T) => U) => List<U>
    reduce: <U>(this: List<T>, f: (state: U, x: T) => U, accumulator: U) => U    
    concat: (this: List<T>, l: List<T>) => List<T>
    toArray: (this: List<T>) => T[]
    count: (this: List<T>) => number
    merge: <U>(this: List<T>, list: List<U>) => List<Pair<T, U>>
}

let ListOperations = <T>(): ListOperations<T> => ({
    map: function <U>(this: List<T>, f: (_: T) => U): List<U> {
        return this.reduce<List<U>>((s, x) => Cons(f(x), s), Empty<U>())
    },
    reduce: function <U>(this: List<T>, f: (state: U, x: T) => U, accumulator: U): U {
        return this.kind == "empty" ? accumulator : this.tail.reduce(f, f(accumulator, this.head)) // Return value of the function is stored in an accumulator
    },
    concat: function (this: List<T>, l: List<T>): List<T> {
        return this.reduce((s, x) => Cons(x, s), l)
    },
    toArray: function (this: List<T>): T[] {
        return this.reduce<T[]>((s, x) => s.concat([x]), [])
    },
    count: function (this: List<T>): number {
        return this.reduce((s) => s + 1, 0)
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

let Cons = <T>(head: T, tail: List<T>): List<T> => ({
    kind: "cons",
    head: head,
    tail: tail,
    ...ListOperations()
})

let Empty = <T>(): List<T> => ({
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
        return Cons( {}, createList(n - 1) )
    }
}

// list[] to List<T>
export let FromArrayToList = <T>(array: T[]): List<T> => { 
    // console.log(array.reduce((s, x) => Cons(x, s) , Empty<T>()));
    // console.log('\n');
    return array.reduce((s, x) => Cons(x, s) , Empty<T>())
}

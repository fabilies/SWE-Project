import { List, Empty, mergeListTypes, createList, Cons } from "../global/ListOps";
import { Pair } from "../global/Pair";
import { Omit, omitMany, omitOne } from "../global/Omit";
import { pickMany, pickOne } from "../global/Pick";
import { Unit } from "../global/Func"
import { FilterBuilder, FilterCondition } from "./Where";

export type Data<T, U> = Pair<List<T>, List<U>> // Track unmodified list in T (all properties) and picked list in U (exclude picked properties)

export type ListType<T> = T extends List<infer U> ? U : never // Infer value of the type T

export type Filter<T, Condition> = { // Set all types that match the Condition to the value of the field (i.e. name: "name")
    [key in keyof T]: T[key] extends Condition ? key : never 
} [keyof T] // Selects all the types of all the keys except for never


interface Selectable<T, U> {
    studentData: Data<T, U>
    Select: <key extends keyof T>(this: Selectable<T, U>, ...properties: key[]) => Selectable<Omit<T, key>, U & Pick<T, key>>
    Include: <key extends Filter<T, List<any>>, P extends keyof ListType<T[key]>>(
        record: key,
        q: (_: initialSelectable<ListType<T[key]>>) => Selectable<Omit<ListType<T[key]>, P>, Pick<ListType<T[key]>, P>>
    ) =>
        Selectable<Omit<T, key>, U & { [k in key]: Array<Pick<ListType<T[key]>, P>> }>

    Where: (filter: (_: FilterBuilder<T & U>) => FilterCondition<T & U>) => Selectable<T, U>
    toList: (this: Selectable<T, U>) => List<U>
}


let Selectable = <T, U>(studentData: Data<T, U>): Selectable<T, U> => ({
    studentData: studentData,
    Select: function <key extends keyof T>(this: Selectable<T, U>, ...properties: key[]): Selectable<Omit<T, key>, U &  Pick<T, key>> {
        
        // const ret: any = {};
        // let select_rec = (_entity, ks: key[], i: number) => {
        //     if(i >= ks.length) {
        //         return
        //     }

        //     let key = ks[i]
        //     ret[key] = (_entity[key])
        //     select_rec(_entity, ks, i + 1)
        // }
        // select_rec(this.studentData.fst, properties, 0)

        return Selectable(this.studentData.map(
            first => first.map(entry => omitMany(entry, properties)),
            second => mergeListTypes(second.merge(this.studentData.fst.map(entry => pickMany(entry, properties))))
        ))

    },
    Include: function <key extends Filter<T, List<any>>, P extends keyof ListType<T[key]>>(
        record: key,
        q: (_: initialSelectable<ListType<T[key]>>) => Selectable<Omit<ListType<T[key]>, P>, Pick<ListType<T[key]>, P>>
    ):
        Selectable<Omit<T, key>, U & { [k in key]: Array<Pick<ListType<T[key]>, P>> }> {
        return Selectable(this.studentData.map(
            first => first.map(entry => omitOne(entry, record)),
            second => mergeListTypes(second.merge(this.studentData.fst.map(entry =>
                ({ [record]: q(createSelectable(entry[record] as any)).toList().reverse().toArray() })))) as any   
        ))
    },
    Where: function (filter: (_: FilterBuilder<T & U>) => FilterCondition<T & U>): Selectable<T, U> {
        let temp_fst = this.studentData.fst
        let temp_snd = this.studentData.snd
        let result = Empty<U>()
        while (temp_fst.kind != 'empty' && temp_snd.kind != 'empty') {
            if (filter(FilterBuilder({ ...temp_fst.head, ...temp_snd.head })).condition) {
                result = Cons(temp_snd.head, result)
            }
            temp_fst = temp_fst.tail
            temp_snd = temp_snd.tail
        }
        return Selectable(Pair(this.studentData.fst, result.reverse()))

    },
    toList: function (this: Selectable<T, U>): List<U> {
        return this.studentData.snd
    }

})

export interface initialSelectable<T> {
    studentData: Data<T, Unit>
    Select: <key extends keyof T>(this: initialSelectable<T>, ...properties: key[]) => Selectable<Omit<T, key>, Pick<T, key>>
}

let initialSelectable = <T>(studentData: Data<T, Unit>): initialSelectable<T> => ({
    studentData: studentData,

    Select: function <key extends keyof T>(this: initialSelectable<T>, ...properties: key[]): Selectable<Omit<T, key>, Pick<T, key>> {
        return Selectable(this.studentData.map(
            first => first.map(entry => omitMany(entry, properties)),
            second => mergeListTypes(second.merge(this.studentData.fst.map(entry => pickMany(entry, properties))))
        ))
    }
})

// Factory method to create a Selectable
export const createSelectable = <T>(list: List<T>): initialSelectable<T> => {
    return initialSelectable(Pair(list, createList(list.count())))
}
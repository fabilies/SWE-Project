import { List, mergeListTypes, createList } from "../global/ListOps";
import { Pair } from "../global/Pair";
import { Omit, omitMany, omitOne } from "../global/Omit";
import { pickMany, pickOne } from "../global/Pick";

type Unit = {}

export type Data<T, U> = Pair<List<T>, List<U>> // Track unmodified list in T (all properties) and picked list in U (exclude picked properties)

export type ListType<T> = T extends List<infer U> ? U : never // Infer value of the type T (overerven)

export type Filter<T, Condition> = {
    [key in keyof T]: T[key] extends Condition ? key : never 
} [keyof T]


interface Selectable<T, U> {
    studentData: Data<T, U>
    Select: <key extends keyof T>(this: Selectable<T, U>, ...properties: key[]) => Selectable<Omit<T, key>, U & Pick<T, key>> // Returns picked properties from T en removed key while Pick does the opposite
    Include: <key extends Filter<T, List<any>>, P extends keyof ListType<T[key]>>
    (
        record: key,
        a: (_: initialSelectable<ListType<T[key]>>) => Selectable<Omit<ListType<T[key]>, P>, Pick<ListType<T[key]>, P>> // Overgebleven properties zitten in P
    ) =>
        Selectable<Omit<T, key>, U & { [k in key]: Array<Pick<ListType<T[key]>, P>> }>

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
        q: (_: initialSelectable<ListType<T[key]>>) => Selectable<Omit<ListType<T[key]>, P>, Pick<ListType<T[key]>, P>> // remove p from grades
    ):
        Selectable<Omit<T, key>, U & { [k in key]: Array<Pick<ListType<T[key]>, P>> }> { // wat je overhoud
        return Selectable(this.studentData.map(
            first => first.map(entry => omitOne(entry, record)),
            second => mergeListTypes(second.merge(this.studentData.fst.map(entry =>
                ({ [record]: q(createSelectable(entry[record] as any)).toList().toArray() })))) as any
        ))
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

// Append list of students to Selectable
export const createSelectable = <T>(list: List<T>): initialSelectable<T> => {
    return initialSelectable(Pair(list, createList(list.count())))
}
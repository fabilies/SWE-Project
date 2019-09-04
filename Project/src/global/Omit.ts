export type Omit<T, key extends keyof T> = Pick<T, Exclude<keyof T, key>>

export let omitOne = <T, key extends keyof T>(entity: T, prop: key): Omit<T, key> => {
    const { [prop]: deleted, ...newState } = entity
    return newState
}

export let omitMany = <T, key extends keyof T>(entity: T, props: key[]): Omit<T, key> => {
    let result = entity as Omit<T, key>
    props.map(prop => {
        result = omitOne(entity, prop as key)
    })
    return result
}

// https://stackoverflow.com/questions/56255212/how-to-omit-delete-many-properties-from-an-object
// https://levelup.gitconnected.com/advanced-typescript-types-with-examples-1d144e4eda9e
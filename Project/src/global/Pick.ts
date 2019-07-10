export let pickOne = <T, key extends keyof T>(entity: T, props: key): Pick<T, key> => {
    return { [props] : entity[props] } as Pick<T, key>
}

// Pick multiple properties
export let pickMany = <T, key extends keyof T>(entity: T, props: key[]) => {
   return props.reduce((s, prop) => (s[prop] = entity[prop], s), {} as Pick<T, key>)
}


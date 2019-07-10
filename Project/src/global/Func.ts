export type Unit = {}

export interface Func<a, b> {
    f: (_: a) => b
}

export let Func = <a, b>(f: (_: a) => b): Func<a, b> => {
    return {
        f: f
    }
}

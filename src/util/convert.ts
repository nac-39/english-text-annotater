import { Text } from "../types/Text"

export const convertText2TextType = (ordinal: string) => {
    const regex = /([,\.'":;~`!\?@#$%^&*\(\)\[\]])/g
    let replaced = ordinal
    replaced = replaced.replace(regex, " " + "$1" + " ")
    replaced = replaced.replace(/[ ]+/g, " ")

    const splitted = replaced.split(" ")
    return splitted.map(word => (
        {
            word: word,
            canAnnotate: !regex.test(word)
        }
    ) as Text)
}


// [...range(0, 5)] => [0, 1, 2, 3, 4]
export function* range(start: number, end: number): Generator<number> {
    for (let i = start; i < end; i++) {
        yield i;
    }
}

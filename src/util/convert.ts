import { Text } from "../types/Text"

export const convertText2TextType = (ordinal: string) => {
    const regex = /([,.'":;~`!\?@#$%^&*\(\)\[\]])/g
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

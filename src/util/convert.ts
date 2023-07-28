import { Text } from "../types/Text"

export const convertText2TextType = (ordinal: string) => {
    const replaceSymbols = [".", ",", ":", ";", "!", "?"]
    let replaced = ordinal
    for (const symbol of replaceSymbols) {
        replaced = replaced.replace(symbol, " " + symbol)
    }
    const splitted = replaced.split(" ")
    return splitted.map(word => (
        {
            word: word,
            canAnnotate: replaceSymbols.indexOf(word) === -1
        }
    ) as Text)
}

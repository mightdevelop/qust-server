const stringIsNumber = (value: any) => isNaN(Number(value))

export function enumToArrayOfIndexes(enumme: any) {
    return Object.keys(enumme)
        .filter(stringIsNumber)
        .map(key => enumme[key])
}
const hexToString = (str1: string) => {
    var hex = str1.toString()
    var str = ''
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16))
    }
    return str
}

const stringToHex = (str: string) => {
    var result = ''
    for (var i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16)
    }
    return result
}

export const util = {
    hexToString,
    stringToHex,
}

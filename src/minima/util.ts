const hexToString = (str1: string) => {
    var hex = str1.toString()
    if (hex.startsWith('0x')) {
        hex = hex.substring(2)
    }
    var str = ''
    for (var i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16))
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

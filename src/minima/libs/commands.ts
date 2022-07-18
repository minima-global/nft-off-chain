import Decimal from 'decimal.js'
import { util } from '../util'

const status = (): Promise<Status> => {
    return new Promise((resolve, reject) => {
        MDS.cmd('status', (data: any) => {
            if (data.status) {
                const statusData: Status = data.response
                resolve(statusData)
            } else {
                reject(data)
            }
        })
    })
}

const txpow_block = (blockNumber: number): Promise<Txpow> => {
    return new Promise((resolve, reject) => {
        MDS.cmd(`txpow block:${blockNumber}`, (data: any) => {
            if (data.status) {
                const txpow: Txpow = data.response
                resolve(txpow)
            } else {
                reject(data)
            }
        })
    })
}

const txpow_txpowid = (txpowid: string): Promise<Txpow> => {
    return new Promise((resolve, reject) => {
        MDS.cmd(`txpow txpowid:${txpowid}`, (data: any) => {
            if (data.status) {
                const txpow: Txpow = data.response
                resolve(txpow)
            } else {
                reject(data)
            }
        })
    })
}

const txpow_address = (address: string): Promise<Txpow[]> => {
    return new Promise((resolve, reject) => {
        MDS.cmd(`txpow address:${address}`, (data: any) => {
            if (data.status) {
                const txpows: Txpow[] = data.response
                resolve(txpows)
            } else {
                reject(data)
            }
        })
    })
}

// get all my tokens
// sendable or locked up
function getAllMyTokens(): Promise<Token[]> {
    return new Promise((resolve, reject) => {
        const command = 'balance'
        MDS.cmd(command, (res) => {
            if (res.status && res.response) {
                const nfts: Token[] = res.response
                resolve(nfts)
            } else {
                reject(res)
            }
        })
    })
}

function sendMaximaMessageToContactById(id: number, message: string): Promise<any> {
    const hexMessage = util.stringToHex(message)
    const command = `maxima action:send id:${id} data:${hexMessage} application:nft-off-chain`
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

const createTransaction = (id: string) => {
    const command = `txncreate id:${id}`
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

const createTransactionOutput = (id: string, address: string, amount: Decimal, tokenId: string) => {
    const command = `txnoutput id:${id} address:${address} amount:${amount} tokenid:${tokenId}`
    console.log('command output: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

const createTransactionInput = (id: string, nftCoinId: string, scriptMMR: boolean) => {
    const command = `txninput id:${id} coinid:${nftCoinId} scriptmmr:${scriptMMR}`
    console.log('command input: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

const exportTransaction = (id: string) => {
    const command = `txnexport id:${id}`
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

const importTransaction = (data: string) => {
    const command = `txnimport data:${data}`
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

const exportTokenId = (tokenId: string) => {
    const command = `tokens action:export tokenid:${tokenId}`
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

const importTokenId = (data: string) => {
    const command = `tokens action:import data:${data}`
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

const signTransaction = (id: string) => {
    // public key: auto
    const command = `txnsign id:${id} publickey:auto`
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

const postTransaction = (id: string) => {
    // public key: auto
    const command = `txnpost id:${id}`
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

// used to verify transaction
const listTransaction = (id: string) => {}

const maxima = (): Promise<any> => {
    const command = `maxima`
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res: any) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

type TokensAction = 'export' | 'import'
const tokens = (tokenId?: string, action?: TokensAction, data?: string): Promise<any> => {
    let tokenArg = ''
    let actionArg = ''
    let dataArg = ''
    tokenId ? (tokenArg = `tokenid:${tokenId}`) : (tokenArg = '')
    action ? (actionArg = `action:${action}`) : (actionArg = '')
    action && action === 'import' && data ? (dataArg = `data:${data}`) : (dataArg = '')

    const command = `tokens ${tokenArg} ${actionArg} ${dataArg}`
    console.log('tokens command: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res: any) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

const newAddress = (): Promise<any> => {
    const command = `newaddress`
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res: any) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

type CoinsArgsTypes = {
    relevant?: boolean
    sendable?: boolean
    coinId?: string
    amount?: number
    address?: string
    tokenId?: string
}
const coins = ({ relevant, sendable, coinId, amount, address, tokenId }: CoinsArgsTypes): Promise<any[]> => {
    const command =
        `coins ` +
        `${buildArg('relevant', relevant)} ` +
        `${buildArg('sendable', sendable)} ` +
        `${buildArg('coinId', coinId)} ` +
        `${buildArg('amount', amount)} ` +
        `${buildArg('address', address)} ` +
        `${buildArg('tokenId', tokenId)}`

    console.log('coins command: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res: any) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

////////////// helpers ////////////////////////

function isPropUndefined(prop: any) {
    return prop === undefined
}

// if prop value is undefined returns an empy string ''
// otherwise returns the name, value pair as a string
// eg 'tokenid:0xA39FCDC0593B9FAB6E194D758B2ADC67DA7416EB01224F873C519C5A90C24AFF'
// or 'amount:10'
function buildArg(propName: string, propValue: any) {
    if (isPropUndefined(propValue)) {
        return ''
    } else {
        return `${propName.toLowerCase()}:${propValue.toString()}`
    }
}

export const commands = {
    status,
    txpow_block,
    txpow_txpowid,
    txpow_address,
    getAllMyTokens,
    sendMaximaMessageToContactById,
    createTransaction,
    createTransactionOutput,
    createTransactionInput,
    exportTransaction,
    importTransaction,
    exportTokenId,
    importTokenId,
    signTransaction,
    postTransaction,
    maxima,
    tokens,
    newAddress,
    coins,
}

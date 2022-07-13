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
}

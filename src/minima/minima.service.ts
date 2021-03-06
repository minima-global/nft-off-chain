import Decimal from 'decimal.js'
import { StepOne } from '../smart-contract/StepOne'
import { StepTwo } from '../smart-contract/StepTwo'
import { commands } from './libs/commands'
import { sql } from './libs/sql'
import { util } from './util'

const getAllMyNFTs = () => {
    return commands.balance().then((allTokens) => {
        return allTokens.filter(isCoinNFTAndSendable)
    })
}

/**
 * @param coin
 * @returns true if the coins is an NFT.
 */
function isCoinNFTAndSendable(coin: any) {
    return typeof coin.token === 'object' && coin.token.nft && parseInt(coin.sendable) > 0
}

function sendMaximaMessageToContactById(id: number, message: string): Promise<any> {
    const hexMessage = util.stringToHex(message)
    return commands.maxima({ action: 'send', id, data: hexMessage, application: 'nft-off-chain' })
}

const sendMessageToFirstContact = (smartContractStep: StepOne | StepTwo) => {
    const message = JSON.stringify(smartContractStep)
    return sendMaximaMessageToContactById(1, message)
}

const sendMessageToMaximAddress = (smartContractStep: StepOne | StepTwo, maximaAddress: string) => {
    const message = JSON.stringify(smartContractStep)
    const hexMessage = util.stringToHex(message)
    return commands.maxima({ action: 'send', to: maximaAddress, data: hexMessage, application: 'nft-off-chain' })
}

const sendTestMessageToFirstContact = (message: string) => {
    return sendMaximaMessageToContactById(1, message)
}

function createTransaction(id: string) {
    return commands.txncreate({ id })
}

function createSellerOutput(txnId: string, sellerAddress: string, minimaAmount: Decimal) {
    // tokenId is minima
    return commands.txnoutput({ id: txnId, amount: minimaAmount, address: sellerAddress, tokenId: '0x00' })
}

function createSellerInput(id: string, nftCoinId: string) {
    return commands.txninput({ id, coinid: nftCoinId, scriptmmr: true })
}

// nft output
function createBuyerOutput(id: string, buyerAddress: string, nftTokenId: string) {
    return commands.txnoutput({ id, amount: new Decimal(1), address: buyerAddress, tokenId: nftTokenId })
}

// creates buyer minima amount input
// also creates the output for the change returned
function createBuyerInput(id: string, minimaCoinId: string, minimaAmount: Decimal, returnAddress: string) {
    return commands
        .txninput({ id, coinid: minimaCoinId, scriptmmr: true })
        .then(() => {
            return commands.coins({ coinId: minimaCoinId })
        })
        .then((coinUsedToPay: any) => {
            console.log('coinUsedToPay', coinUsedToPay)
            const myCoin = coinUsedToPay[0]
            const myCoinValue = new Decimal(myCoin.amount)
            const changeAmount = myCoinValue.minus(minimaAmount)
            if (changeAmount.isZero()) {
                // do nothing
            } else {
                return commands.txnoutput({ id, amount: changeAmount, address: returnAddress, tokenId: '0x00' })
            }
        })
}

function exportTransaction(id: string) {
    return commands.txnexport({ id })
}

function importTransaction(data: string) {
    return commands.txnimport({ data })
}

function exportTokenId(tokenId: string) {
    return commands.tokens({ action: 'export', tokenId })
}

function importTokenId(data: string) {
    return commands.tokens({ action: 'import', data })
}

function signTransaction(id: string) {
    return commands.txnsign({ id, publicKey: 'auto' })
}

function postTransaction(id: string) {
    return commands.txnpost({ id })
}

async function getMyMaximaAddress() {
    const maximaData = await commands.maxima()
    return maximaData.contact
}

async function getMyWalletAddress() {
    const addressData = await commands.newaddress()
    console.log('getMyWalletAddress ', addressData.address)
    return addressData.address
}

// returns the coinid for a given tokenid
// a token can have multiple coins, unless its an NFT
// this will return the first coin from the list
function getCoinIdFromNFTTokenId(tokenId: string): Promise<string> {
    return new Promise((resolve, reject) => {
        commands.coins({ tokenId }).then((response: any) => {
            if (response.length === 1) {
                resolve(response[0].coinid)
            } else {
                reject('not an NFT')
            }
        })
    })
}

// gets the smallest coin which satisfies the amount
// TODO: only looks at a single coin. It is not able to combine multiple coins together from your wallet
// In fact the smart contract itself can only handle a single coin at a time
async function getMinimaCoinId(minimaAmount: Decimal) {
    const coins = await commands.coins({ tokenId: '0x00', relevant: true })

    const sortedCoins = coins
        .filter((coin) => {
            const amount = new Decimal(coin.amount)
            return amount.gte(minimaAmount)
        })
        .sort((c1, c2) => {
            // smallest to largest
            const val1: Decimal = new Decimal(c1.amount)
            const val2: Decimal = new Decimal(c2.amount)
            return val1.comparedTo(val2)
        })
    console.log('sorted filtered coins', sortedCoins)

    let myCoin = sortedCoins[0]
    console.log('myCoin', myCoin)
    if (myCoin === undefined) {
        throw new Error('You do not have sufficient minima')
    }
    return myCoin.coinid
}

function createAndInsertTable() {
    return sql
        .executeQuery('create table if not exists test (id int auto_increment primary key, col1 varchar(255))')
        .then(() => {
            return sql.executeQuery("insert into test(col1) values ('testval1')")
        })
        .then(() => {
            return sql.executeQuery('select * from test')
        })
}

// persist auction ids so we can keep polling for a buyer after reloading the app
function storeMyAuctionId(auctionId: number) {
    const propName = 'myAuctionIds'
    const auctionIdString = localStorage.getItem(propName)
    if (auctionIdString === null) {
        localStorage.setItem(propName, JSON.stringify([auctionId]))
    } else {
        const auctionIds = JSON.parse(auctionIdString)
        auctionIds.push(auctionId)
        localStorage.setItem(propName, JSON.stringify(auctionIds))
    }
}

// remove the persisted id so we can stop polling it
function removeMyAuctionId(auctionId: number) {
    const propName = 'myAuctionIds'
    const auctionIdString = localStorage.getItem(propName)
    if (auctionIdString === null) {
        console.error('no auction ids stored yet')
    } else {
        const auctionIds = JSON.parse(auctionIdString)
        const removed = auctionIds.filter((id: number) => id !== auctionId)
        auctionIds.push(auctionId)
        localStorage.setItem(propName, JSON.stringify(removed))
    }
}

function getMyAuctionIds() {
    const propName = 'myAuctionIds'
    const auctionIdString = localStorage.getItem(propName)
    if (auctionIdString === null) {
        return []
    } else {
        const auctionIds = JSON.parse(auctionIdString)
        return auctionIds
    }
}

function checkTransaction(txnId: string) {
    return commands.txncheck({ id: txnId })
}

export const minima_service = {
    getAllMyNFTs,
    sendMessageToFirstContact,
    sendTestMessageToFirstContact,
    sendMessageToMaximAddress,
    createTransaction,
    createSellerOutput,
    createSellerInput,
    createBuyerOutput,
    createBuyerInput,
    exportTransaction,
    importTransaction,
    exportTokenId,
    importTokenId,
    signTransaction,
    postTransaction,
    getMyMaximaAddress,
    getMyWalletAddress,
    getCoinIdFromNFTTokenId,
    getMinimaCoinId,
    createAndInsertTable,
    storeMyAuctionId,
    removeMyAuctionId,
    getMyAuctionIds,
    checkTransaction,
}

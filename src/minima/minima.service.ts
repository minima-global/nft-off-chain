import Decimal from 'decimal.js'
import { StepOne } from '../smart-contract/StepOne'
import { StepTwo } from '../smart-contract/StepTwo'
import { commands } from './libs/commands'

const getAllMyNFTs = () => {
    return commands.getAllMyTokens().then((allTokens) => {
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

const sendMessageToFirstContact = (smartContractStep: StepOne | StepTwo) => {
    const message = JSON.stringify(smartContractStep)
    return commands.sendMaximaMessageToContactById(1, message)
}

const sendTestMessageToFirstContact = (message: string) => {
    return commands.sendMaximaMessageToContactById(1, message)
}

function createTransaction(id: string) {
    return commands.createTransaction(id)
}

function createSellerOutput(txnId: string, sellerAddress: string, minimaAmount: Decimal) {
    // tokenId is minima
    return commands.createTransactionOutput(txnId, sellerAddress, minimaAmount, '0x00')
}

function createSellerInput(id: string, nftCoinId: string) {
    return commands.createTransactionInput(id, nftCoinId, true)
}

function createBuyerOutput(id: string, buyerAddress: string, nftTokenId: string) {
    return commands.createTransactionOutput(id, buyerAddress, new Decimal(1), nftTokenId)
}

function createBuyerInput(id: string, minimaCoinId: string) {
    return commands.createTransactionInput(id, minimaCoinId, true)
}

function exportTransaction(id: string) {
    return commands.exportTransaction(id)
}

function importTransaction(data: string) {
    return commands.importTransaction(data)
}

function exportTokenId(tokenId: string) {
    return commands.exportTokenId(tokenId)
}

function importTokenId(data: string) {
    return commands.importTokenId(data)
}

function signTransaction(id: string) {
    return commands.signTransaction(id)
}

function postTransaction(id: string) {
    return commands.postTransaction(id)
}

async function getMyAddress() {
    const maximaData = await commands.maxima()
    return maximaData.contact
}

export const minima_service = {
    getAllMyNFTs,
    sendMessageToFirstContact,
    sendTestMessageToFirstContact,
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
    getMyAddress,
}

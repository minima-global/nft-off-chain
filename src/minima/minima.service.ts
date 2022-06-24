import { commands } from './index'

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

export const minima_service = {
    getAllMyNFTs,
}

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
function isCoinNFTAndSendable(coin: Token) {
    return coin.decimals === '0' && parseInt(coin.sendable) > 0
}

export const minima_service = {
    getAllMyNFTs,
}

import { AuctionCandidate, AuctionDB } from './Auction'

// const MARKETPLACE_ENDPOINT = 'http://127.0.0.1:3000'

const MARKETPLACE_ENDPOINT = 'https://34.105.217.165'

function listNFTForAuction(nft: Token, price: number, sellerId: string): Promise<AuctionDB> {
    const nftDetail = nft.token as TokenNFTDetail
    if (!nftDetail.nft) {
        throw new Error('Not an NFT')
    }

    const body: AuctionCandidate = {
        nftName: nftDetail.name,
        nftDescription: nftDetail.description,
        nftUrl: nftDetail.url,
        nftTokenId: nft.tokenid,
        nftPrice: price,
        nftSellerId: sellerId,
        detailsJson: nftDetail,
    }

    const url = MARKETPLACE_ENDPOINT + '/auctions'
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }
    return fetch(url, options).then((response) => response.json())
}

function getAllAuctions(): Promise<AuctionDB[]> {
    const url = MARKETPLACE_ENDPOINT + '/auctions'
    return fetch(url).then((response) => response.json())
}

export const marketplace_service = {
    getAllAuctions,
    listNFTForAuction,
}

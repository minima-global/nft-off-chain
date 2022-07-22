import Decimal from 'decimal.js'
import { AuctionCandidate, AuctionDB } from './Auction'

// const MARKETPLACE_ENDPOINT = 'http://127.0.0.1:3000'

const MARKETPLACE_ENDPOINT = 'https://34.105.217.165'

function listNFTForAuction(nft: Token, price: Decimal, sellerId: string, sellerAddress: string): Promise<AuctionDB> {
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
        sellerAddress,
    }

    const url = MARKETPLACE_ENDPOINT + '/auctions'
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }
    return fetch(url, options).then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            return response.json().then((json) => {
                return Promise.reject(json)
            })
        }
    })
}

function removeNFTFromAuctionList(id: number) {
    const url = MARKETPLACE_ENDPOINT + '/auctions/' + id
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    return fetch(url, options).then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            return response.json().then((json) => {
                return Promise.reject(json)
            })
        }
    })
}

function getAllAuctions(): Promise<AuctionDB[]> {
    const url = MARKETPLACE_ENDPOINT + '/auctions'
    return fetch(url).then((response) => response.json())
}

function getAuctionById(id: number): Promise<AuctionDB> {
    const url = MARKETPLACE_ENDPOINT + '/auctions/' + id
    return fetch(url).then((response) => response.json())
}

function buyItem(auctionItem: AuctionDB, buyerAddress: string): Promise<AuctionDB> {
    const itemId = auctionItem.id
    const url = MARKETPLACE_ENDPOINT + '/auctions/' + itemId

    const body: AuctionDB = {
        ...auctionItem,
        buyerAddress,
    }

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }
    return fetch(url, options).then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            return response.json().then((json) => {
                return Promise.reject(json)
            })
        }
    })
}

// keep polling the server
// only respond with a resolved promise once a buyer has been found
function pollServerForBuyer(id: number): Promise<AuctionDB> {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            getAuctionById(id).then((res) => {
                const hasBuyer = res.buyerAddress !== null
                if (hasBuyer) {
                    clearInterval(intervalId)
                    resolve(res)
                } else {
                    // do not reject, keep polling
                }
            })
        }, 10000)
    })
}

export const marketplace_service = {
    getAllAuctions,
    getAuctionById,
    listNFTForAuction,
    removeNFTFromAuctionList,
    buyItem,
    pollServerForBuyer,
}

import Decimal from 'decimal.js'
import { TokenDetails } from './TokenDetails'

export interface AuctionCandidate {
    nftName: string
    nftDescription: string
    nftUrl: string
    nftTokenId: string
    nftPrice: Decimal | string // we are storing strings in DB
    nftSellerId: string
    detailsJson?: TokenDetails
    sellerAddress: string
    buyerAddress?: string
}

export interface AuctionDB extends AuctionCandidate {
    id: number
}


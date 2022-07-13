import { TokenDetails } from './TokenDetails'

export interface AuctionCandidate {
    nftName: string
    nftDescription: string
    nftUrl: string
    nftTokenId: string
    nftPrice: number //TODO: convert to Decimal??
    nftSellerId: string
    detailsJson?: TokenDetails
}

export interface AuctionDB extends AuctionCandidate {
    id: number
}

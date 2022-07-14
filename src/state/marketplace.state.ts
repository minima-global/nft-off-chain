import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './store'
import { enqueueSuccessSnackbar, enqueueFailureSnackbar } from './notifications.state'
import { marketplace_service } from '../WeTransfer/marketplace.service'
import { AuctionDB } from '../WeTransfer/Auction'
import { minima_service } from '../minima'

export interface MarketplaceState {
    auctions: AuctionDB[]
}

const initialMarketplaceState: MarketplaceState = {
    auctions: [],
}

export const fetchAllAuctions = (): AppThunk => async (dispatch, getState) => {
    return marketplace_service.getAllAuctions().then(
        (auctions) => {
            dispatch(enqueueSuccessSnackbar('Auctions Fetched'))
            dispatch(marketplaceActions.addAllAuctions(auctions))
        },
        (err) => {
            const message = 'Auction Fetch Failure, ' + JSON.stringify(err)
            dispatch(enqueueFailureSnackbar(message))
        }
    )
}

export const createAuction =
    (nft: any): AppThunk =>
    async (dispatch, getState) => {
        const contact = await minima_service.getMyAddress()

        return marketplace_service.listNFTForAuction(nft, 20, 'some-user-id', contact).then(
            (res: AuctionDB) => {
                dispatch(enqueueSuccessSnackbar('Auction Created'))
                dispatch(pollServerForBuyer(res))
            },
            (err) => {
                const message = 'Auction Creation Failure, ' + JSON.stringify(err)
                dispatch(enqueueFailureSnackbar(message))
            }
        )
    }

export const buyAuctionItem =
    (auctionItem: AuctionDB): AppThunk =>
    async (dispatch, getState) => {
        const contact = await minima_service.getMyAddress()
        const res = await marketplace_service.buyItem(auctionItem, contact)
        console.log('item bought', res)
        // server should now inform the seller you have bought the item
        // you should store the item while you wait for the seller to contact you,
        // so you can verify the item is correct
    }

export const pollServerForBuyer =
    (auctionItem: AuctionDB): AppThunk =>
    async (dispatch, getState) => {
        const boughtAuction = await marketplace_service.pollServerForBuyer(auctionItem.id)
        console.log('bought auction, kick of transfer process', boughtAuction)
    }

export const marketplaceSlice = createSlice({
    name: 'marketplace',
    initialState: initialMarketplaceState,
    reducers: {
        addAllAuctions: (state, action) => {
            state.auctions = action.payload
        },
    },
})

// export reducers and actions
const marketplaceActions = marketplaceSlice.actions
const marketplaceReducer = marketplaceSlice.reducer

export default marketplaceReducer

//////////// selectors///////////
const selectMarketplace = (state: RootState): MarketplaceState => {
    return state.marketplace
}
export const getAllAuctions = createSelector(selectMarketplace, (marketplace: MarketplaceState) => marketplace.auctions)

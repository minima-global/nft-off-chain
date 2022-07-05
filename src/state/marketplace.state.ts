import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './store'
import { enqueueSnackbar } from './notifications.state'
import { marketplace_service } from '../WeTransfer/marketplace.service'
import { AuctionDB } from '../WeTransfer/Auction'

export interface MarketplaceState {
    auctions: AuctionDB[]
}

const initialMarketplaceState: MarketplaceState = {
    auctions: [],
}

export const fetchAllAuctions = createAsyncThunk('marketplace/fetchAllAuctions', async () => {
    return marketplace_service.getAllAuctions()
})

export const createAuction = createAsyncThunk('marketplace/createAuction', async (nft: any) => {
    return marketplace_service.listNFTForAuction(nft, 20, 'some-user-id')
})

export const marketplaceSlice = createSlice({
    name: 'marketplace',
    initialState: initialMarketplaceState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllAuctions.fulfilled, (state, action) => {
            state.auctions = action.payload
        })
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

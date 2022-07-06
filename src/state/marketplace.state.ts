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


export const fetchAllAuctions = createAsyncThunk('marketplace/fetchAllAuctions', async (_, thunkAPI) => {
    return marketplace_service.getAllAuctions().then(
        (auctions) => {
            const auctionFetchSuccess = {
                message: 'Auctions Fetched',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                },
            }
            thunkAPI.dispatch(enqueueSnackbar(auctionFetchSuccess))
            return auctions
        },
        (err) => {
            const auctionFetchFailure = {
                message: 'Auction Fetch Failure, ' + JSON.stringify(err),
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                },
            }
            thunkAPI.dispatch(enqueueSnackbar(auctionFetchFailure))
            return []
        }
    )
})

export const createAuction = createAsyncThunk('marketplace/createAuction', async (nft: any, thunkAPI) => {
    return marketplace_service.listNFTForAuction(nft, 20, 'some-user-id').then(
        (res) => {
            const auctionCreatedSuccess = {
                message: 'Auction Created',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                },
            }
            thunkAPI.dispatch(enqueueSnackbar(auctionCreatedSuccess))
            return res
        },
        (err) => {
            const auctionCreatedFailure = {
                message: 'Auction Creation Failure, ' + JSON.stringify(err),
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                },
            }
            thunkAPI.dispatch(enqueueSnackbar(auctionCreatedFailure))
        }
    )
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

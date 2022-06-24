import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './store'
import { enqueueSnackbar } from './notifications.state'
import { minima_service } from './../minima'

export interface NftWalletState {
    nfts: any[]
}

const initialNftwalletState: NftWalletState = {
    nfts: [],
}

export const fetchNfts = createAsyncThunk('nftwallet/fetchNfts', async () => {
    return minima_service.getAllMyNFTs()
})

export const sendNftToAuction = createAsyncThunk('nftwallet/sendNftToAuction', async (nft: any) => {
    // return minima_service.getAllMyNFTs()
})

// creates actions and reducers
export const marketplaceSlice = createSlice({
    name: 'nftwallet',
    initialState: initialNftwalletState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchNfts.fulfilled, (state, action) => {
            state.nfts = action.payload
        })
    },
})

// export reducers and actions
const nftWalletActions = marketplaceSlice.actions
const nftWalletReducer = marketplaceSlice.reducer

export default nftWalletReducer

// selectors
const selectNfts = (state: RootState): NftWalletState => {
    return state.nftwallet
}
export const getAllMyNfts = createSelector(selectNfts, (nftWallet: NftWalletState) => nftWallet.nfts)


import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './store'
import { enqueueSnackbar } from './notifications.state'

export interface NftWalletState {
    nfts: any[]
}

const initialNftwalletState: NftWalletState = {
    nfts: [],
}

// creates actions and reducers
export const marketplaceSlice = createSlice({
    name: 'nftwallet',
    initialState: initialNftwalletState,
    reducers: {},
})

// export reducers and actions
const nftWalletActions = marketplaceSlice.actions
const nftWalletReducer = marketplaceSlice.reducer

export default nftWalletReducer

// selectors

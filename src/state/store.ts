import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import marketplaceReducer from './/marketplace.state'
import nftWalletReducer from './nftwallet.state'
import notificationsReducer from './notifications.state'
import swapContractReducer from './swapcontract.state'

export const store = configureStore({
    reducer: {
        marketplace: marketplaceReducer,
        nftwallet: nftWalletReducer,
        notifications: notificationsReducer,
        swapcontract: swapContractReducer,
    },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

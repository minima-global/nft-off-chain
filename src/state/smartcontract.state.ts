import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './store'
import { enqueueSnackbar } from './notifications.state'
import { minima_service, util } from './../minima'
import { StepOne } from '../smart-contract/StepOne'

export interface SmartContractState {
    transactions: StepOne[]
}

const initialSmartContratState: SmartContractState = {
    transactions: [],
}

export const processMaximaMessage =
    (maximaMessage: MaximaMessage): AppThunk =>
    (dispatch, getState) => {
        const message = util.hexToString(maximaMessage.data)
        const maximaMessageRecieved = {
            message: 'Maxima Message: ' + message,
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
            },
        }
        dispatch(enqueueSnackbar(maximaMessageRecieved))
    }

// create action to recieve step one data and send via maxima

// creates actions and reducers
export const smartContractSlice = createSlice({
    name: 'smartContract',
    initialState: initialSmartContratState,
    reducers: {},
})

// export reducers and actions
const smartContractActions = smartContractSlice.actions
const smartContractReducer = smartContractSlice.reducer

export default smartContractReducer

// selectors
const selectSmartContract = (state: RootState): SmartContractState => {
    return state.smartcontract
}
export const getAllSmartContractTransactions = createSelector(
    selectSmartContract,
    (smartContract: SmartContractState) => smartContract.transactions
)

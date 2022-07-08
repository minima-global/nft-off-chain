import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './store'
import { enqueueSnackbar } from './notifications.state'
import { minima_service, util } from './../minima'
import { StepOne } from '../smart-contract/StepOne'
import { StepTwo } from '../smart-contract/StepTwo'

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

        // check if message is a step one, two or three
        try {
            const messageObject = JSON.parse(message)
            if (messageObject.step === 1) {
                dispatch(receiveStepOneData(messageObject))
            }
            if (messageObject.step === 2) {
                dispatch(receiveStepTwoData(messageObject))
            }
            if (messageObject.step === 3) {
                dispatch(receiveStepOneData(messageObject))
            }
        } catch (err) {
            const maximaMessageTypeFailure = {
                message: 'Not a smart contract step message type',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                },
            }
            dispatch(enqueueSnackbar(maximaMessageTypeFailure))
        }
    }

// create action to recieve step one data and send via maxima
export const sendStepOneData = createAsyncThunk(
    'smartcontract/send-step-one',
    async (stepOneData: StepOne, thunkAPI) => {
        // TODO: create transaction
        // TODO: create transaction input
        // TODO: create transaction output
        // TODO: export and add to step one
        return minima_service.sendMessageToFirstContact(stepOneData).then(
            (maxRes) => {
                console.log('Maxima response:', maxRes)
                const stepOneSendSuccess = {
                    message: 'Step One Data Sent',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                    },
                }
                thunkAPI.dispatch(enqueueSnackbar(stepOneSendSuccess))
            },
            (err) => {
                console.log('Maxima error:', err)
                const stepOneSendFailure = {
                    message: 'Step One Data Sent Failure, ' + JSON.stringify(err),
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                    },
                }
                thunkAPI.dispatch(enqueueSnackbar(stepOneSendFailure))
            }
        )
    }
)

export const receiveStepOneData =
    (stepOneData: StepOne): AppThunk =>
    (dispatch, getState) => {
        const maximaMessageRecieved = {
            message: 'Step one data recieved, creating step two: ' + JSON.stringify(stepOneData),
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
            },
        }
        dispatch(enqueueSnackbar(maximaMessageRecieved))

        // import transaction data

        // verify data

        // use it to create step two
    }

export const sendStepTwoData = createAsyncThunk(
    'smartcontract/send-step-two',
    async (stepTwoData: StepTwo, thunkAPI) => {
        // TODO: create transaction
        // TODO: create transaction input
        // TODO: create transaction output
        // TODO: export and add to step one
        return minima_service.sendMessageToFirstContact(stepTwoData).then(
            (maxRes) => {
                console.log('Maxima response:', maxRes)
                const stepTwoSendSuccess = {
                    message: 'Step Two Data Sent',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                    },
                }
                thunkAPI.dispatch(enqueueSnackbar(stepTwoSendSuccess))
            },
            (err) => {
                console.log('Maxima error:', err)
                const stepTwoSendFailure = {
                    message: 'Step Two Data Sent Failure, ' + JSON.stringify(err),
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                    },
                }
                thunkAPI.dispatch(enqueueSnackbar(stepTwoSendFailure))
            }
        )
    }
)

export const receiveStepTwoData =
    (stepTwoData: StepTwo): AppThunk =>
    (dispatch, getState) => {
        const maximaMessageRecieved = {
            message: 'Step two data recieved, posting transaction: ' + JSON.stringify(stepTwoData),
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
            },
        }
        dispatch(enqueueSnackbar(maximaMessageRecieved))

        // verify data

        // use it to create step three
    }


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

import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './store'
import { enqueueSuccessSnackbar, enqueueFailureSnackbar } from './notifications.state'
import { minima_service, util } from '../minima'
import { StepOne } from '../smart-contract/StepOne'
import { StepTwo } from '../smart-contract/StepTwo'
import { Transaction } from '../smart-contract/Transaction'
import { AuctionDB } from '../WeTransfer/Auction'
import Decimal from 'decimal.js'

export interface SmartContractState {
    transactions: Record<string, Transaction>
}

const initialSmartContratState: SmartContractState = {
    transactions: {},
}

export const processMaximaMessage =
    (maximaMessage: MaximaMessage): AppThunk =>
    (dispatch, getState) => {
        const message = util.hexToString(maximaMessage.data)
        const successMessage = 'Maxima Message: ' + message
        dispatch(enqueueSuccessSnackbar(successMessage))

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
            dispatch(enqueueFailureSnackbar('Not a smart contract step message type'))
        }
    }

///////////////////////////////////////////////////// step one stuff //////////////////////////////////////////////////////

// Use the data from the sold auction item,
// to create step one of the smart contract.
export const generateStepOne =
    (boughtAuction: AuctionDB): AppThunk =>
    async (dispatch, getState) => {
        const step = 1
        const txnId = `${boughtAuction.nftTokenId}-${Date.now()}`
        const sellerAddress = await minima_service.getMyWalletAddress()
        const minimaAmount = new Decimal(boughtAuction.nftPrice)
        const minimaTokenId = '0x00'
        const nftCoinId = await minima_service.getCoinIdFromTokenId(boughtAuction.nftTokenId)
        const nftTokenId = boughtAuction.nftTokenId
        const nftTokenIdData = '' // leave empty, will fill in in the build step
        const txnData = '' // leave empty, will fill in in the build step

        // create step one object and dispatch builStepOne with it
        const stepOne: StepOne = {
            step,
            txnId,
            sellerAddress,
            minimaAmount,
            minimaTokenId,
            nftCoinId,
            nftTokenId,
            nftTokenIdData,
            txnData,
        }
        dispatch(enqueueSuccessSnackbar('Step One generated from sold auction'))
        dispatch(buildStepOne(stepOne))
    }

// turn step one into inputs and outputs
// and exports transacton
// store the step one in state
export const buildStepOne =
    (stepOne: StepOne): AppThunk =>
    async (dispatch, getState) => {
        try {
            await minima_service.createTransaction(stepOne.txnId)
            dispatch(enqueueSuccessSnackbar('Transaction Created'))

            await minima_service.createSellerOutput(stepOne.txnId, stepOne.sellerAddress, stepOne.minimaAmount)
            dispatch(enqueueSuccessSnackbar('Seller Output Created'))

            await minima_service.createSellerInput(stepOne.txnId, stepOne.nftCoinId)
            dispatch(enqueueSuccessSnackbar('Seller Input Created'))

            const tokenIdRes: any = await minima_service.exportTokenId(stepOne.nftTokenId)
            const tokenIdExportData = tokenIdRes.data
            // store the step one in state to send to buyer
            stepOne.nftTokenIdData = tokenIdExportData
            dispatch(enqueueSuccessSnackbar('Token Id Exported'))
            // wait for transaction export data to be added to stepOne before we save to state

            const transactionRes: any = await minima_service.exportTransaction(stepOne.txnId)
            const transactionExportData = transactionRes.data
            // do something with the export data
            // need to store export data in state so it can be added to the stepOne object
            stepOne.txnData = transactionExportData
            dispatch(enqueueSuccessSnackbar('Seller Transaction Exported'))
            dispatch(smartContractActions.addStepOneData(stepOne))
        } catch (err: any) {
            const message = 'Transaction Failure, ' + err.error
            dispatch(enqueueFailureSnackbar(message))
        }
    }

// create action to get step one data and send via maxima
export const sendStepOneData =
    (stepOneData: StepOne): AppThunk =>
    (dispatch, getState) => {
        // stepOneData in state has the exported transaction data, and exported token id data
        const id = stepOneData.txnId
        const storedStepOneData = selectTransactionStepOneById(id)(getState())
        if (!storedStepOneData) {
            console.error('incorrect  transaction id')
            return
        }

        minima_service.sendMessageToFirstContact(storedStepOneData).then(
            (maxRes) => {
                console.log('Maxima response:', maxRes)
                dispatch(enqueueSuccessSnackbar('Step One Data Sent'))
            },
            (err) => {
                console.log('Maxima error:', err)
                const message = 'Step One Data Sent Failure, ' + JSON.stringify(err)
                dispatch(enqueueFailureSnackbar(message))
            }
        )
    }

export const receiveStepOneData =
    (stepOneData: StepOne): AppThunk =>
    (dispatch, getState) => {
        const message = 'Step one data recieved, creating step two: ' + JSON.stringify(stepOneData)
        dispatch(enqueueSuccessSnackbar(message))
        dispatch(smartContractActions.addStepOneData(stepOneData))

        // import transaction data

        // verify data

        // use it to create step two
        dispatch(generateStepTwo(stepOneData))
    }

///////////////////////////////////////////////////// step two stuff //////////////////////////////////////////////////////

// Use the data from step one,
// to create step two of the smart contract.
export const generateStepTwo =
    (stepOneData: StepOne): AppThunk =>
    async (dispatch, getState) => {
        const step = 2
        const txnId = stepOneData.txnId
        const buyerAddress = await minima_service.getMyWalletAddress()
        const nftAmount = 1
        const nftTokenId = stepOneData.nftTokenId
        const minimaCoinId = await minima_service.getMinimaCoinId(stepOneData.minimaAmount).then(
            (x) => x, // do nothing pass through
            (err) => {
                dispatch(enqueueFailureSnackbar(err.toString()))
            }
        )
        const txnData = '' // leave empty, will fill in in the build step

        // create step one object and dispatch builStepOne with it
        const stepTwo: StepTwo = {
            step,
            txnId,
            buyerAddress,
            nftAmount,
            nftTokenId,
            minimaCoinId,
            txnData,
        }
        dispatch(enqueueSuccessSnackbar('Step Two generated from step one data'))
        dispatch(buildStepTwo(stepTwo))
    }

// turn step two into inputs and outputs
// and export transacton
// store the step two in state
export const buildStepTwo =
    (stepTwo: StepTwo): AppThunk =>
    async (dispatch, getState) => {
        // use id from step two to get transaction data from step one
        const id = stepTwo.txnId
        const storedStepOneData = selectTransactionStepOneById(id)(getState())
        if (!storedStepOneData) {
            console.error('incorrect  transaction id')
            return
        }
        const transactionData = storedStepOneData.txnData
        const tokenIdData = storedStepOneData.nftTokenIdData

        try {
            await minima_service.importTransaction(transactionData)
            dispatch(enqueueSuccessSnackbar('Transaction Imported'))

            await minima_service.importTokenId(tokenIdData)
            dispatch(enqueueSuccessSnackbar('Token ID Imported'))

            await minima_service.createBuyerOutput(stepTwo.txnId, stepTwo.buyerAddress, stepTwo.nftTokenId)
            dispatch(enqueueSuccessSnackbar('Buyer Output Created'))

            await minima_service.createBuyerInput(stepTwo.txnId, stepTwo.minimaCoinId)
            dispatch(enqueueSuccessSnackbar('Buyer Input Created'))

            const data = await minima_service.signTransaction(stepTwo.txnId)
            console.log('sign transaction data:', data)
            dispatch(enqueueSuccessSnackbar('Transaction Signed'))

            const res: any = await minima_service.exportTransaction(stepTwo.txnId)
            const exportData = res.data
            // do something with the export data
            // need to store export data in state so it can be added to the stepTwo object
            stepTwo.txnData = exportData
            dispatch(enqueueSuccessSnackbar('Buyer Transaction Exported'))
            dispatch(smartContractActions.addStepTwoData(stepTwo))
        } catch (err: any) {
            const message = 'Transaction Failure, ' + err.error
            dispatch(enqueueFailureSnackbar(message))
        }
    }

// create action to get step one data and send via maxima
export const sendStepTwoData =
    (stepTwoData: StepTwo): AppThunk =>
    (dispatch, getState) => {
        // stepTwoData in state has the exported transaction data
        const id = stepTwoData.txnId
        const storedStepTwoData = selectTransactionStepTwoById(id)(getState())
        if (!storedStepTwoData) {
            console.error('incorrect  transaction id')
            return
        }

        minima_service.sendMessageToFirstContact(stepTwoData).then(
            (maxRes) => {
                console.log('Maxima response:', maxRes)
                dispatch(enqueueSuccessSnackbar('Step Two Data Sent'))
            },
            (err) => {
                console.log('Maxima error:', err)
                const message = 'Step Two Data Sent Failure, ' + JSON.stringify(err)
                dispatch(enqueueFailureSnackbar(message))
            }
        )
    }

// after buyer clicks the buy button,
// they expect to recieve from the seller, via maxima,
//
export const receiveStepTwoData =
    (stepTwoData: StepTwo): AppThunk =>
    (dispatch, getState) => {
        const message = 'Step two data recieved, posting transaction: ' + JSON.stringify(stepTwoData)
        dispatch(enqueueSuccessSnackbar(message))
        dispatch(smartContractActions.addStepTwoData(stepTwoData))

        // verify data

        // use it to create step three
    }

export const signAndPostTransaction =
    (transactionId: string): AppThunk =>
    (dispatch, getState) => {
        const storedStepTwoData = selectTransactionStepTwoById(transactionId)(getState())
        if (!storedStepTwoData) {
            console.error('incorrect  transaction id')
            return
        }

        const transactionData = storedStepTwoData.txnData

        minima_service.importTransaction(transactionData).then((data) => {
            console.log('import transaction data:', data)
            dispatch(enqueueSuccessSnackbar('Transaction Imported'))

            minima_service.signTransaction(transactionId).then((data) => {
                console.log('sign transaction data:', data)
                dispatch(enqueueSuccessSnackbar('Transaction Signed'))

                minima_service.postTransaction(transactionId).then((data) => {
                    console.log('post transaction data:', data)
                    dispatch(enqueueSuccessSnackbar('Transaction Posted'))
                })
            })
        }) // TODO failure
    }

// creates actions and reducers
export const smartContractSlice = createSlice({
    name: 'smartContract',
    initialState: initialSmartContratState,
    reducers: {
        addStepOneData: (state, action) => {
            const stepOneData = action.payload
            const id = stepOneData.txnId
            // create transaction if it doesnt exist
            if (id in state.transactions) {
                state.transactions[id].stepOne = stepOneData
            } else {
                state.transactions[id] = {
                    stepOne: stepOneData,
                }
            }
        },
        addStepTwoData: (state, action) => {
            const stepTwoData = action.payload
            const id = stepTwoData.txnId
            // transaction should already have been created via step one
            state.transactions[id].stepTwo = stepTwoData
        },
    },
})

// export reducers and actions
const smartContractActions = smartContractSlice.actions
const smartContractReducer = smartContractSlice.reducer

export default smartContractReducer

// selectors
const selectSmartContract = (state: RootState): SmartContractState => {
    return state.swapcontract
}
export const selectAllSmartContractTransactions = createSelector(selectSmartContract, (smartContract: SmartContractState) => smartContract.transactions)

// will return either the transaction or undefined
export const selectTransactionById = (txnId: string) => (state: RootState) =>
    state.swapcontract.transactions[txnId] ? state.swapcontract.transactions[txnId] : null

export const selectTransactionStepOneById = (txnId: string) => (state: RootState) =>
    state.swapcontract.transactions[txnId].stepOne ? state.swapcontract.transactions[txnId].stepOne : null

export const selectTransactionStepTwoById = (txnId: string) => (state: RootState) =>
    state.swapcontract.transactions[txnId].stepTwo ? state.swapcontract.transactions[txnId].stepTwo : null

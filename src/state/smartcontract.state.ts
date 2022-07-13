import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './store'
import { enqueueSnackbar } from './notifications.state'
import { minima_service, util } from './../minima'
import { StepOne } from '../smart-contract/StepOne'
import { StepTwo } from '../smart-contract/StepTwo'
import { Transaction } from '../smart-contract/Transaction'

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

///////////////////////////////////////////////////// step one stuff //////////////////////////////////////////////////////

// turn step one into inputs and outputs
// and exports transacton
// store the step one in state
export const buildStepOne =
    (stepOne: StepOne): AppThunk =>
    (dispatch, getState) => {
        minima_service.createTransaction(stepOne.txnId).then(() => {
            const transactionCreatedSuccess = {
                message: 'Transaction Created',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                },
            }
            dispatch(enqueueSnackbar(transactionCreatedSuccess))

            minima_service.createSellerOutput(stepOne.txnId, stepOne.sellerAddress, stepOne.minimaAmount).then(() => {
                const sellerOutputCreatedSuccess = {
                    message: 'Seller Output Created',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                    },
                }
                dispatch(enqueueSnackbar(sellerOutputCreatedSuccess))

                minima_service.createSellerInput(stepOne.txnId, stepOne.nftCoinId).then(() => {
                    const sellerInputCreatedSuccess = {
                        message: 'Seller Input Created',
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success',
                        },
                    }
                    dispatch(enqueueSnackbar(sellerInputCreatedSuccess))

                    minima_service.exportTokenId(stepOne.nftTokenId).then((res: any) => {
                        const exportData = res.data
                        // store the step one in state to send to buyer
                        stepOne.nftTokenIdData = exportData
                        const tokenIdExportedSuccess = {
                            message: 'Token Id Exported',
                            options: {
                                key: new Date().getTime() + Math.random(),
                                variant: 'success',
                            },
                        }
                        dispatch(enqueueSnackbar(tokenIdExportedSuccess))
                        // wait for transaction export data to be added to stepOne before we save to state

                        minima_service.exportTransaction(stepOne.txnId).then((res: any) => {
                            const exportData = res.data
                            // do something with the export data
                            // need to store export data in state so it can be added to the stepOne object
                            stepOne.txnData = exportData
                            const transactionExportedSuccess = {
                                message: 'Seller Transaction Exported',
                                options: {
                                    key: new Date().getTime() + Math.random(),
                                    variant: 'success',
                                },
                            }
                            dispatch(enqueueSnackbar(transactionExportedSuccess))
                            dispatch(smartContractActions.addStepOneData(stepOne))
                        }, outputError)
                    }, outputError)
                }, outputError)
            }, outputError)
        }, outputError)

        function outputError(err: any) {
            const transactionFailure = {
                message: 'Transaction Failure, ' + err.error,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                },
            }
            dispatch(enqueueSnackbar(transactionFailure))
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

        // prettier fucking up so put this outside
        const stepOneSendSuccess = {
            message: 'Step One Data Sent',
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
            },
        }

        minima_service.sendMessageToFirstContact(storedStepOneData).then(
            (maxRes) => {
                console.log('Maxima response:', maxRes)
                // const stepOneSendSuccess = {
                //     message: 'Step One Data Sent',
                //     options: {
                //         key: new Date().getTime() + Math.random(),
                //         variant: 'success',
                //     },
                // }
                dispatch(enqueueSnackbar(stepOneSendSuccess))
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
                dispatch(enqueueSnackbar(stepOneSendFailure))
            }
        )
    }

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
        dispatch(smartContractActions.addStepOneData(stepOneData))

        // import transaction data

        // verify data

        // use it to create step two
    }

///////////////////////////////////////////////////// step two stuff //////////////////////////////////////////////////////

// turn step two into inputs and outputs
// and export transacton
// store the step two in state
export const buildStepTwo =
    (stepTwo: StepTwo): AppThunk =>
    (dispatch, getState) => {
        // use id from step two to get transaction data from step one
        const id = stepTwo.txnId
        const storedStepOneData = selectTransactionStepOneById(id)(getState())
        if (!storedStepOneData) {
            console.error('incorrect  transaction id')
            return
        }
        const transactionData = storedStepOneData.txnData
        const tokenIdData = storedStepOneData.nftTokenIdData

        minima_service.importTransaction(transactionData).then(() => {
            const transactionImportedSuccess = {
                message: 'Transaction Imported',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                },
            }
            dispatch(enqueueSnackbar(transactionImportedSuccess))

            minima_service.importTokenId(tokenIdData).then(() => {
                const tokenIdImportedSuccess = {
                    message: 'Token ID Imported',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                    },
                }
                dispatch(enqueueSnackbar(tokenIdImportedSuccess))

                // need to import tokenId because buyer node has no record of it
                minima_service.createBuyerOutput(stepTwo.txnId, stepTwo.buyerAddress, stepTwo.nftTokenId).then(() => {
                    const buyerOutputCreatedSuccess = {
                        message: 'Buyer Output Created',
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success',
                        },
                    }
                    dispatch(enqueueSnackbar(buyerOutputCreatedSuccess))

                    minima_service.createBuyerInput(stepTwo.txnId, stepTwo.minimaCoinId).then(() => {
                        const buyerInputCreatedSuccess = {
                            message: 'Buyer Input Created',
                            options: {
                                key: new Date().getTime() + Math.random(),
                                variant: 'success',
                            },
                        }
                        dispatch(enqueueSnackbar(buyerInputCreatedSuccess))

                        minima_service.signTransaction(stepTwo.txnId).then((data) => {
                            console.log('sign transaction data:', data)
                            const transactionSignedSuccess = {
                                message: 'Transaction Signed',
                                options: {
                                    key: new Date().getTime() + Math.random(),
                                    variant: 'success',
                                },
                            }
                            dispatch(enqueueSnackbar(transactionSignedSuccess))

                            minima_service.exportTransaction(stepTwo.txnId).then((res: any) => {
                                const exportData = res.data
                                // do something with the export data
                                // need to store export data in state so it can be added to the stepTwo object
                                stepTwo.txnData = exportData
                                const transactionExportedSuccess = {
                                    message: 'Buyer Transaction Exported',
                                    options: {
                                        key: new Date().getTime() + Math.random(),
                                        variant: 'success',
                                    },
                                }
                                dispatch(enqueueSnackbar(transactionExportedSuccess))
                                dispatch(smartContractActions.addStepTwoData(stepTwo))
                            }, outputError)
                        }, outputError)
                    }, outputError)
                }, outputError)
            }, outputError)
        }, outputError)

        function outputError(err: any) {
            const transactionFailure = {
                message: 'Transaction Failure, ' + err.error,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                },
            }
            dispatch(enqueueSnackbar(transactionFailure))
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
                dispatch(enqueueSnackbar(stepTwoSendSuccess))
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
                dispatch(enqueueSnackbar(stepTwoSendFailure))
            }
        )
    }

// after buyer clicks the buy button,
// they expect to recieve from the seller, via maxima,
//
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
            const transactionImportedSuccess = {
                message: 'Transaction Imported',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                },
            }
            dispatch(enqueueSnackbar(transactionImportedSuccess))

            minima_service.signTransaction(transactionId).then((data) => {
                console.log('sign transaction data:', data)
                const transactionSignedSuccess = {
                    message: 'Transaction Signed',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                    },
                }
                dispatch(enqueueSnackbar(transactionSignedSuccess))

                minima_service.postTransaction(transactionId).then((data) => {
                    console.log('post transaction data:', data)
                    const transactionPostedSuccess = {
                        message: 'Transaction Posted',
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success',
                        },
                    }
                    dispatch(enqueueSnackbar(transactionPostedSuccess))
                })
            })
        })
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
    return state.smartcontract
}
export const selectAllSmartContractTransactions = createSelector(
    selectSmartContract,
    (smartContract: SmartContractState) => smartContract.transactions
)

// will return either the transaction or undefined
export const selectTransactionById = (txnId: string) => (state: RootState) =>
    state.smartcontract.transactions[txnId] ? state.smartcontract.transactions[txnId] : null

export const selectTransactionStepOneById = (txnId: string) => (state: RootState) =>
    state.smartcontract.transactions[txnId].stepOne ? state.smartcontract.transactions[txnId].stepOne : null

export const selectTransactionStepTwoById = (txnId: string) => (state: RootState) =>
    state.smartcontract.transactions[txnId].stepTwo ? state.smartcontract.transactions[txnId].stepTwo : null
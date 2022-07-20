import { useState } from 'react'

import { minima_service } from '../../../minima'
import { sendStepOneData, sendStepTwoData, buildStepOne, buildStepTwo, signAndPostTransaction } from '../../../state/swapcontract.state'
import { useAppDispatch, useAppSelector } from './../../../state/hooks'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'
import { StepOne } from '../../../smart-contract/StepOne'
import { StepTwo } from '../../../smart-contract/StepTwo'
import Decimal from 'decimal.js'

const SmartContract = () => {
    const dispatch = useAppDispatch()
    const initialStepOne: StepOne = {
        step: 1,
        txnId: '',
        sellerAddress: '',
        minimaAmount: new Decimal(1),
        minimaTokenId: '0x00',
        nftCoinId: '',
        nftTokenId: '',
        nftTokenIdData: '',
        txnData: '',
    }
    const initialStepTwo: StepTwo = {
        step: 2,
        txnId: '',
        buyerAddress: '',
        nftAmount: 1,
        nftTokenId: '',
        minimaAmount: new Decimal(1),
        minimaCoinId: '',
        txnData: '',
    }
    const [stepOne, setStepOne] = useState(initialStepOne)
    const [stepTwo, setStepTwo] = useState(initialStepTwo)
    const [postTransactionId, setPostTransactionId] = useState('')

    const sendTestMessageToFirstContact = () => {
        minima_service.sendTestMessageToFirstContact('test').then(console.log)
    }

    const stepOneFieldChange = (event: any) => {
        const newValue = event.target.value
        const field = event.target.name
        setStepOne({ ...stepOne, [field]: newValue })
    }

    const onBuildStepOneClicked = () => {
        console.log('onBuildStepOneClicked', stepOne)
        dispatch(buildStepOne(stepOne))
    }

    const onSendStepOneClicked = () => {
        console.log('onSendStepOneClicked', stepOne)
        dispatch(sendStepOneData(stepOne))
    }

    const stepTwoFieldChange = (event: any) => {
        const newValue = event.target.value
        const field = event.target.name
        setStepTwo({ ...stepTwo, [field]: newValue })
    }

    const onBuildStepTwoClicked = () => {
        console.log('onBuildStepTwoClicked', stepTwo)
        dispatch(buildStepTwo(stepTwo))
    }

    const onSendStepTwoClicked = () => {
        console.log('onSendStepTwoClicked', stepTwo)
        dispatch(sendStepTwoData(stepTwo))
    }

    const transactionIdFieldChange = (event: any) => {
        const newValue = event.target.value
        setPostTransactionId(newValue)
    }

    const onSignAndPostClicked = () => {
        console.log('onSignAndPostClicked', postTransactionId)
        dispatch(signAndPostTransaction(postTransactionId))
    }

    return (
        <>
            <h1>Smart Contract</h1>
            <button onClick={sendTestMessageToFirstContact}>Send test message to first contact</button>
            <button
                onClick={() => {
                    minima_service.getMinimaCoinId(new Decimal(0.1)).then(console.log)
                }}
            >
                coin more than 0.1 minima
            </button>

            <h2>Step One - Seller</h2>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField label="Transaction ID Name" name="txnId" fullWidth value={stepOne.txnId} onChange={stepOneFieldChange} />
                <TextField label="Seller Address" name="sellerAddress" fullWidth value={stepOne.sellerAddress} onChange={stepOneFieldChange} />
                <TextField label="Minima Amount" name="minimaAmount" type="number" fullWidth value={stepOne.minimaAmount} onChange={stepOneFieldChange} />
                <TextField label="Minima Token ID" name="minimaTokenId" fullWidth value={stepOne.minimaTokenId} onChange={stepOneFieldChange} />
                <TextField label="NFT Token ID" name="nftTokenId" fullWidth value={stepOne.nftTokenId} onChange={stepOneFieldChange} />
                <TextField label="NFT Coin ID" name="nftCoinId" fullWidth value={stepOne.nftCoinId} onChange={stepOneFieldChange} />
            </Box>
            <Button variant="contained" sx={{ mr: 2 }} onClick={onBuildStepOneClicked}>
                Build Seller Transaction
            </Button>
            <Button variant="contained" onClick={onSendStepOneClicked}>
                Send to Maxima Contact 1
            </Button>

            <h2>Step Two - Buyer</h2>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField label="Transaction ID Name" name="txnId" fullWidth value={stepTwo.txnId} onChange={stepTwoFieldChange} />
                <TextField label="Buyer Address" name="buyerAddress" fullWidth value={stepTwo.buyerAddress} onChange={stepTwoFieldChange} />
                <TextField label="NFT Amount" name="nftAmount" type="number" fullWidth value={stepTwo.nftAmount} onChange={stepTwoFieldChange} />
                <TextField label="NFT Token ID" name="nftTokenId" fullWidth value={stepTwo.nftTokenId} onChange={stepTwoFieldChange} />
                <TextField label="Minima Coin ID" name="minimaCoinId" fullWidth value={stepTwo.minimaCoinId} onChange={stepTwoFieldChange} />
            </Box>
            <Button variant="contained" sx={{ mr: 2 }} onClick={onBuildStepTwoClicked}>
                Build Buyer Transaction
            </Button>
            <Button variant="contained" onClick={onSendStepTwoClicked}>
                Send to Maxima Contact 1
            </Button>

            <h2>Step Three - Seller</h2>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField label="Transaction ID Name" name="txnId" fullWidth value={postTransactionId} onChange={transactionIdFieldChange} />
            </Box>
            <Button variant="contained" onClick={onSignAndPostClicked}>
                Sign and post transaction
            </Button>
        </>
    )
}

export default SmartContract

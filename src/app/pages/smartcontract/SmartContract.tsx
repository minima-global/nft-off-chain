import { useState } from 'react'

import { commands } from '../../../minima'
import { sendStepOneData, sendStepTwoData } from './../../../state/smartcontract.state'
import { useAppDispatch, useAppSelector } from './../../../state/hooks'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'
import { StepOne } from '../../../smart-contract/StepOne'
import { StepTwo } from '../../../smart-contract/StepTwo'

const SmartContract = () => {
    const dispatch = useAppDispatch()
    const initialStepOne: StepOne = {
        step: 1,
        txnId: '',
        sellerAddress: '',
        minimaAmount: 1,
        minimaTokenId: '0x00',
        nftCoinId: '',
        txnData: '',
    }
    const initialStepTwo: StepTwo = {
        step: 2,
        txnId: '',
        buyerAddress: '',
        nftAmount: 1,
        nftTokenId: '',
        minimaCoinId: '',
        txnData: '',
    }
    const [stepOne, setStepOne] = useState(initialStepOne)
    const [stepTwo, setStepTwo] = useState(initialStepTwo)

    const sendTestMessageToFirstContact = () => {
        commands.sendMaximaMessageToContactById(1, 'test').then(console.log)
    }

    const stepOneFieldChange = (event: any) => {
        const newValue = event.target.value
        const field = event.target.name
        setStepOne({ ...stepOne, [field]: newValue })
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

    const onSendStepTwoClicked = () => {
        console.log('onSendStepTwoClicked', stepTwo)
        dispatch(sendStepTwoData(stepTwo))
    }

    return (
        <>
            <h1>Smart Contract</h1>
            <button onClick={sendTestMessageToFirstContact}>Send test message to first contact</button>

            <h2>Step One</h2>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    label="Transaction ID Name"
                    name="txnId"
                    fullWidth
                    value={stepOne.txnId}
                    onChange={stepOneFieldChange}
                />
                <TextField
                    label="Seller Address"
                    name="sellerAddress"
                    fullWidth
                    value={stepOne.sellerAddress}
                    onChange={stepOneFieldChange}
                />
                <TextField
                    label="Minima Amount"
                    name="minimaAmount"
                    type="number"
                    fullWidth
                    value={stepOne.minimaAmount}
                    onChange={stepOneFieldChange}
                />
                <TextField
                    label="Minima Token ID"
                    name="minimaTokenId"
                    fullWidth
                    value={stepOne.minimaTokenId}
                    onChange={stepOneFieldChange}
                />
                <TextField
                    label="NFT Coin ID"
                    name="nftCoinId"
                    fullWidth
                    value={stepOne.nftCoinId}
                    onChange={stepOneFieldChange}
                />
            </Box>
            <Button variant="contained" onClick={onSendStepOneClicked}>
                Send to Maxima Contact 1
            </Button>

            <h2>Step Two</h2>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    label="Transaction ID Name"
                    name="txnId"
                    fullWidth
                    value={stepTwo.txnId}
                    onChange={stepTwoFieldChange}
                />
                <TextField
                    label="Buyer Address"
                    name="buyerAddress"
                    fullWidth
                    value={stepTwo.buyerAddress}
                    onChange={stepTwoFieldChange}
                />
                <TextField
                    label="NFT Amount"
                    name="nftAmount"
                    type="number"
                    fullWidth
                    value={stepTwo.nftAmount}
                    onChange={stepTwoFieldChange}
                />
                <TextField
                    label="NFT Token ID"
                    name="nftTokenId"
                    fullWidth
                    value={stepTwo.nftTokenId}
                    onChange={stepTwoFieldChange}
                />
                <TextField
                    label="Minima Coin ID"
                    name="minimaCoinId"
                    fullWidth
                    value={stepTwo.minimaCoinId}
                    onChange={stepTwoFieldChange}
                />
            </Box>
            <Button variant="contained" onClick={onSendStepTwoClicked}>
                Send to Maxima Contact 1
            </Button>

            <h2>Step Three</h2>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField label="Transaction ID Name" fullWidth />
                <TextField label="Seller Address" fullWidth />
                <TextField label="Minima Amount" type="number" fullWidth />
                <TextField label="Minima Token ID" defaultValue="0x00" fullWidth />
                <TextField label="NFT Coin ID" fullWidth />
            </Box>
            <Button variant="contained">Send to Maxima Contact 1</Button>
        </>
    )
}

export default SmartContract

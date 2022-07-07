import { useState } from 'react'

import { commands } from '../../../minima'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'
import { StepOne } from '../../../smart-contract/StepOne'

const SmartContract = () => {
    const initialStepOne: StepOne = {
        step: 1,
        txnId: '',
        sellerAddress: '',
        minimaAmount: 1,
        minimaTokenId: '0x00',
        nftCoinId: '',
        txnData: '',
    }
    const [stepOne, setStepOne] = useState(initialStepOne)

    const sendTestMessageToFirstContact = () => {
        commands.sendMaximaMessageToContactById(1, 'test').then(console.log)
    }

    const stepOneFieldChange = (event: any) => {
        const newValue = event.target.value
        const field = event.target.name
        setStepOne({ ...stepOne, [field]: newValue })
    }

    const onSendToFirstContactClicked = () => {
        console.log('onSendToFirstContactClicked', stepOne)
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
            <Button variant="contained" onClick={onSendToFirstContactClicked}>
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
                <TextField label="Transaction ID Name" fullWidth />
                <TextField label="Seller Address" fullWidth />
                <TextField label="Minima Amount" type="number" fullWidth />
                <TextField label="Minima Token ID" defaultValue="0x00" fullWidth />
                <TextField label="NFT Coin ID" fullWidth />
            </Box>
            <Button variant="contained">Send to Maxima Contact 1</Button>

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

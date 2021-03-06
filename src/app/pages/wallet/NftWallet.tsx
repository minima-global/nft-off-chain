import { useEffect } from 'react'
import { fetchNfts, getAllMyNfts } from './../../../state/nftwallet.state'
import { useAppDispatch, useAppSelector } from './../../../state/hooks'

import Grid from '@mui/material/Grid'
import NftCard from './NftfCard'

const NftWallet = () => {
    const dispatch = useAppDispatch()
    const nfts = useAppSelector(getAllMyNfts)
    console.log('nfts', nfts)

    useEffect(() => {
        dispatch(fetchNfts())
    }, [dispatch])

    return (
        <>
            <h1>NFT Wallet ({nfts.length})</h1>
            <Grid container spacing={2}>
                {nfts.map((nft, i) => (
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <NftCard key={i} nft={nft}></NftCard>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default NftWallet

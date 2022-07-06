import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './../../../state/hooks'
import { getAllAuctions, fetchAllAuctions } from '../../../state/marketplace.state'
import AuctionCard from './AuctionCard'

import Grid from '@mui/material/Grid'

const Marketplace = () => {
    const dispatch = useAppDispatch()
    const auctions = useAppSelector(getAllAuctions)
    console.log('auctions', auctions)

    useEffect(() => {
        dispatch(fetchAllAuctions())
    }, [dispatch])

    return (
        <>
            <h1>Marketplace 2</h1>
            <Grid container spacing={2}>
                {auctions.map((auction, i) => (
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <AuctionCard auction={auction}></AuctionCard>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default Marketplace

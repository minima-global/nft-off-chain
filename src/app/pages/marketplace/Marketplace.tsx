import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './../../../state/hooks'
import { getAllAuctions, fetchAllAuctions } from '../../../state/marketplace.state'

const Marketplace = () => {
    const dispatch = useAppDispatch()
    const auctions = useAppSelector(getAllAuctions)
    console.log('auctions', auctions)

    useEffect(() => {
        dispatch(fetchAllAuctions())
    }, [dispatch])

    return <h1>Marketplace</h1>
}

export default Marketplace

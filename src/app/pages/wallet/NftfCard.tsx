import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from './../../../state/hooks'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { sendNftToAuction } from './../../../state/nftwallet.state'
import CardMedia from '@mui/material/CardMedia'
import { util } from './../../../minima'

interface IProps {
    nft: any
}

const NftCard = ({ nft }: IProps) => {
    const dispatch = useAppDispatch()

    const onAuctionNft = (nft: Token) => {
        return () => {
            dispatch(sendNftToAuction(nft))
        }
    }

    const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
    const imageUrl = decodeURI(util.hexToString(nft.token.url))

    return (
        <>
            <Card>
                {imageUrl ? (
                    <CardMedia component="img" height="194" image={imageUrl} />
                ) : (
                    <CardMedia component="img" height="194" image={fallbackImage} />
                )}

                <CardContent>
                    <Typography variant="h5">
                        {nft.token.name ? <div>{nft.token.name}</div> : <div>Token not found</div>}
                    </Typography>
                    <Typography component="div" variant="caption">
                        tokenId: {nft.tokenid}
                    </Typography>
                    <Button variant="text" onClick={onAuctionNft(nft)}>
                        Auction
                    </Button>
                </CardContent>
            </Card>
        </>
    )
}

export default NftCard

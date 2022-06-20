import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from './../../../state/hooks'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { sendNftToAuction } from './../../../state/nftwallet.state'
import CardMedia from '@mui/material/CardMedia'

interface IProps {
    nft: Token
}

const NftCard = ({ nft }: IProps) => {
    const dispatch = useAppDispatch()

    const onAuctionNft = (nft: Token) => {
        return () => {
            dispatch(sendNftToAuction(nft))
        }
    }

    const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
    const imageField: any = nft.description
    let imageUrl = null // populate with image if we have one, or keep null if we don't

    // TODO: move this into the auction object in redux so it doesnt parse on every render

    // https://bugzilla.mozilla.org/show_bug.cgi?id=1554068
    // Firefox users still see error in console even if we catch it
    try {
        var parser = new DOMParser()
        const doc = parser.parseFromString(imageField, 'application/xml')
        const errorNode2 = doc.querySelector('parsererror')
        if (errorNode2) {
            console.log('Token does not contain an image: ' + nft.token)
        } else {
            console.log('parsing succeeded')
            var imageString = doc.getElementsByTagName('artimage')[0].innerHTML
            imageUrl = `data:image/jpeg;base64,${imageString}`
        }
    } catch (err) {
        console.error('Token does not contain an image: ' + nft.token)
    }

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
                        {nft.token ? <div>{nft.token}</div> : <div>Token not found</div>}
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

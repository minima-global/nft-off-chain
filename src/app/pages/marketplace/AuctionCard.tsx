import { AuctionDB } from '../../../WeTransfer/Auction'
import { util } from '../../../minima'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardMedia from '@mui/material/CardMedia'
import { buyAuctionItem, deleteAuction } from './../../../state/marketplace.state'
import { useAppDispatch } from './../../../state/hooks'

interface IProps {
    auction: AuctionDB
}

const AuctionCard = ({ auction }: IProps) => {
    const dispatch = useAppDispatch()
    const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
    let imageUrl = null // populate with image if we have one, or keep null if we don't

    if (auction.nftUrl) {
        imageUrl = util.hexToString(auction.nftUrl)
    }

    function onBuyItemClicked() {
        dispatch(buyAuctionItem(auction))
    }

    function onDeleteItemClicked() {
        dispatch(deleteAuction(auction.id))
    }

    return (
        <Card sx={{ minWidth: 275 }}>
            {imageUrl ? <CardMedia component="img" height="194" image={imageUrl} /> : <CardMedia component="img" height="194" image={fallbackImage} />}

            <CardContent>
                <Typography variant="h5" component="div">
                    {auction.nftName}
                </Typography>
                <Typography variant="h6" component="div" gutterBottom>
                    {auction.nftPrice} minima
                </Typography>
                <Typography sx={{ fontSize: 14 }}>{auction.nftTokenId}</Typography>
            </CardContent>
            <CardActions>
                <Button onClick={onBuyItemClicked} size="small">
                    Buy
                </Button>
                <Button onClick={onDeleteItemClicked} size="small">
                    Delete
                </Button>
            </CardActions>
        </Card>
    )
}

export default AuctionCard

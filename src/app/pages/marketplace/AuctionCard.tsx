import { AuctionDB } from '../../../WeTransfer/Auction'
import { util } from '../../../minima'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardMedia from '@mui/material/CardMedia'

interface IProps {
    auction: AuctionDB
}

const AuctionCard = ({ auction }: IProps) => {
    const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
    let imageUrl = null // populate with image if we have one, or keep null if we don't

    if (auction.nftUrl) {
        imageUrl = util.hexToString(auction.nftUrl)
    }

    return (
        <Card sx={{ minWidth: 275 }}>
            {imageUrl ? (
                <CardMedia component="img" height="194" image={imageUrl} />
            ) : (
                <CardMedia component="img" height="194" image={fallbackImage} />
            )}

            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {auction.nftName}
                </Typography>
                <Typography variant="h5" component="div">
                    {auction.nftTokenId}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    )
}

export default AuctionCard

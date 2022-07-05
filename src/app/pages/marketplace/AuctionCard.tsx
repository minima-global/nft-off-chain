import { AuctionDB } from '../../../WeTransfer/Auction'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

interface IProps {
    auction: AuctionDB
}

const AuctionCard = ({ auction }: IProps) => {
    return (
        <Card sx={{ minWidth: 275 }}>
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

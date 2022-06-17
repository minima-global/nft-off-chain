import Marketplace from '../pages/marketplace/Marketplace'
import NftWallet from '../pages/wallet/NftWallet'

const Routes = [
    {
        path: '/',
        sidebarName: 'Marketplace',
        element: <Marketplace></Marketplace>,
    },
    {
        path: '/wallet',
        sidebarName: 'NFT Wallet',
        element: <NftWallet></NftWallet>,
    },
]

export default Routes

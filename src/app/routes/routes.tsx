import Marketplace from '../pages/marketplace/Marketplace'
import NftWallet from '../pages/wallet/NftWallet'
import SmartContract from '../pages/smartcontract/SmartContract'

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
    {
        path: '/smartcontract',
        sidebarName: 'Smart Contract',
        element: <SmartContract></SmartContract>,
    },
]

export default Routes

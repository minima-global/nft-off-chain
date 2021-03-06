import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './store'
import { enqueueSuccessSnackbar, enqueueFailureSnackbar } from './notifications.state'
import { marketplace_service } from '../WeTransfer/marketplace.service'
import { AuctionDB } from '../WeTransfer/Auction'
import { minima_service } from '../minima'
import { generateStepOne } from './swapcontract.state'
import Decimal from 'decimal.js'

export interface MarketplaceState {
    auctions: AuctionDB[]
}

const initialMarketplaceState: MarketplaceState = {
    auctions: [],
}

export const fetchAllAuctions = (): AppThunk => async (dispatch, getState) => {
    return marketplace_service.getAllAuctions().then(
        (auctions) => {
            dispatch(enqueueSuccessSnackbar('Auctions Fetched'))
            dispatch(marketplaceActions.addAllAuctions(auctions))
        },
        (err) => {
            const message = 'Auction Fetch Failure, ' + JSON.stringify(err)
            dispatch(enqueueFailureSnackbar(message))
        }
    )
}

export const createAuction =
    (nft: any, price: Decimal): AppThunk =>
    async (dispatch, getState) => {
        const contact = await minima_service.getMyMaximaAddress()

        return marketplace_service.listNFTForAuction(nft, price, 'some-user-id', contact).then(
            (res: AuctionDB) => {
                dispatch(enqueueSuccessSnackbar('Auction Created'))
                dispatch(pollServerForBuyer(res.id))
                minima_service.storeMyAuctionId(res.id)
            },
            (err) => {
                const message = 'Auction Creation Failure, ' + JSON.stringify(err)
                dispatch(enqueueFailureSnackbar(message))
            }
        )
    }

// delete auction from WeTransfer server
// also delete auction from list of auction we are polling
export const deleteAuction =
    (id: number): AppThunk =>
    async (dispatch, getState) => {
        minima_service.removeMyAuctionId(id)
        return marketplace_service.removeNFTFromAuctionList(id).then(
            () => {
                dispatch(enqueueSuccessSnackbar(`Auction ${id} Deleted`))
                dispatch(fetchAllAuctions())
            },
            (err) => {
                const message = 'Auction Delete Failure, ' + JSON.stringify(err)
                dispatch(enqueueFailureSnackbar(message))
            }
        )
    }

export const buyAuctionItem =
    (auctionItem: AuctionDB): AppThunk =>
    async (dispatch, getState) => {
        const contact = await minima_service.getMyMaximaAddress()
        const res = await marketplace_service.buyItem(auctionItem, contact)
        console.log('item bought', res)
        // server should now inform the seller you have bought the item
        // you should store the item while you wait for the seller to contact you,
        // so you can verify the item is correct
    }

// TODO: switch for websockets or server sent events
// https://stackoverflow.com/questions/59870074/websocket-send-to-specific-user-nodejs
// https://medium.com/voodoo-engineering/websockets-on-production-with-node-js-bdc82d07bb9f
// https://stackoverflow.com/questions/16280747/sending-message-to-a-specific-connected-users-using-websocket
// https://masteringjs.io/tutorials/express/server-sent-events#:~:text=Server%2Dsent%20events%20are%20a,URLs%20or%20additional%20npm%20modules.
// https://javascript.info/server-sent-events
export const pollServerForBuyer =
    (auctionItemId: number): AppThunk =>
    async (dispatch, getState) => {
        const boughtAuction: AuctionDB = await marketplace_service.pollServerForBuyer(auctionItemId)
        // This is the very first line of code where the seller hears there is a buyer for the auction item
        console.log('bought auction, kick of transfer process', boughtAuction)
        dispatch(deleteAuction(auctionItemId))
        dispatch(generateStepOne(boughtAuction))
    }

export const pollMyOpenAuctions = (): AppThunk => async (dispatch, getState) => {
    const auctionIds = minima_service.getMyAuctionIds()
    dispatch(enqueueSuccessSnackbar('Waiting for buyer on live auctions ' + auctionIds.join()))
    auctionIds.forEach((auctionId: number) => {
        dispatch(pollServerForBuyer(auctionId))
    })
}

////////////////// reducers //////////////////
export const marketplaceSlice = createSlice({
    name: 'marketplace',
    initialState: initialMarketplaceState,
    reducers: {
        addAllAuctions: (state, action) => {
            state.auctions = action.payload
        },
    },
})

// export reducers and actions
const marketplaceActions = marketplaceSlice.actions
const marketplaceReducer = marketplaceSlice.reducer

export default marketplaceReducer

//////////// selectors///////////
const selectMarketplace = (state: RootState): MarketplaceState => {
    return state.marketplace
}
export const getAllAuctions = createSelector(selectMarketplace, (marketplace: MarketplaceState) => {
    // convert nft price to decimal
    return marketplace.auctions.map((auction) => {
        return {
            ...auction,
            nftPrice: new Decimal(auction.nftPrice),
        }
    })
})

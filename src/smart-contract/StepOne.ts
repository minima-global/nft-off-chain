import Decimal from 'decimal.js'

export interface StepOne {
    step: number

    // fields used to create the transaction
    txnId: string

    // for outputs
    sellerAddress: string
    minimaAmount: Decimal
    minimaTokenId: string

    // for inputs
    nftCoinId: string

    // seller doesn't need to add this to the smart contract.
    // But the buyer does. So seller exports this and buyer imports it.
    nftTokenId: string
    // nftTokenId exported by seller
    nftTokenIdData: string

    // partially created transaction data
    txnData: string
}

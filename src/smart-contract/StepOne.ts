export interface StepOne {
    step: number

    // fields used to create the transaction
    txnId: string
    sellerAddress: string
    minimaAmount: number
    minimaTokenId: string
    nftCoinId: string

    // partially created transaction data
    txnData: string
}

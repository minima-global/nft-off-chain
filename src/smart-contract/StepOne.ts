export interface StepOne {
    step: number

    // fields used to create the transaction
    txnId: string

    // for outputs
    sellerAddress: string
    minimaAmount: number
    minimaTokenId: string

    // for inputs
    nftCoinId: string

    // partially created transaction data
    txnData: string
}

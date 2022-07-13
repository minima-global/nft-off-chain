export interface StepTwo {
    step: number

    // fields used to create the transaction
    txnId: string

    // for outputs
    buyerAddress: string
    nftAmount: number // will only be 1
    nftTokenId: string

    // for inputs
    minimaCoinId: string

    // partially created transaction data
    txnData: string
}

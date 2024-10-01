
export interface DeployNFTFactoryParams {
    owner: string, salt: number, name: string, symbol: string,
}

export type MintNFT = {
    recipient: string, 
    uri: string,
    collection_address: string,
}


export type ResponseSendTransaction = {
    status: boolean,
    transactionHash?: string,
    blockNumber?: number,
    events?: any
    data?: any,
    message?: any,
}


export type SetPackageParam = {
    token : string,
    amounts: number[]
}

export type DepositParam = {
    token : string,
    id: number
}



export type ListingByAdminParam = {
    nftsAddress: string,
    nftIds: number[],
    prices: number[],
    currencies: string[],
    durations: number[],
}


export type UnListingParam = {
    nftsAddress: string,
    nftIds: number[]
}


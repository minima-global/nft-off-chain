const MARKETPLACE_ENDPOINT = 'http://127.0.0.1:3000'

function listNFTForAuction(nft: any) {
    const testBody = {
        firstName: nft.token.name,
        lastName: nft.tokenid,
    }
    const url = MARKETPLACE_ENDPOINT + '/users'
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(testBody),
    }
    return fetch(url, options).then((response) => response.json())
}

function getAllAuctions() {
    const url = MARKETPLACE_ENDPOINT + '/users'
    return fetch(url).then((response) => response.json())
}

export const marketplace_service = {
    getAllAuctions,
    listNFTForAuction,
}

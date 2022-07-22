function executeQuery(query: string) {
    return new Promise((resolve, reject) => {
        MDS.sql(query, (res) => {
            console.log(query, res)
            if (res.status) {
                resolve(res)
            } else {
                reject(res)
            }
        })
    })
}

export const sql = {
    executeQuery,
}

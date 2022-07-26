import Decimal from 'decimal.js'

/**
 * Show Help. [] are required. () are optional. Chain multiple commands with ;
 */
const help = () => {
    throw 'Not yet implemented'
}

/**
 * (clean:true) - Show general status for Minima and clean RAM
 */
type StatusArgsTypes = {
    clean?: boolean
}
const status = ({ clean }: StatusArgsTypes = {}) => {
    const command = `status ` + `${buildArg('clean', clean)}`

    console.log('status command: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res: any) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * (depth:) (cascade:true|false) - Print a tree representation of the blockchain. Depth default 32, Cascade false.
 */
const printtree = () => {
    throw 'Not yet implemented'
}

/**
 * View Burn metrics
 */
const burn = () => {
    throw 'Not yet implemented'
}

/**
 * [enable:true|false] (filter:) - Show the message stacks of the internal Minima Engine with optional filter string
 */
const trace = () => {
    throw 'Not yet implemented'
}

/**
 * (amount:) - Check the speed of hashing of this device. Defaults to 1 million hashes
 */
const hashtest = () => {
    throw 'Not yet implemented'
}

/**
 * (txpowid:txpowid) (block:) (address:) - Search for a specific TxPoW
 */
const txpow = () => {
    throw 'Not yet implemented'
}

/**
 * (relevant:true) (sendable:true) (coinid:) (amount:) (address:) (tokenid:) - Search for coins
 */
type CoinsArgsTypes = {
    relevant?: boolean
    sendable?: boolean
    coinId?: string
    amount?: number
    address?: string
    tokenId?: string
}
const coins = ({ relevant, sendable, coinId, amount, address, tokenId }: CoinsArgsTypes = {}): Promise<any[]> => {
    const command =
        `coins ` +
        `${buildArg('relevant', relevant)} ` +
        `${buildArg('sendable', sendable)} ` +
        `${buildArg('coinId', coinId)} ` +
        `${buildArg('amount', amount)} ` +
        `${buildArg('address', address)} ` +
        `${buildArg('tokenId', tokenId)}`

    console.log('coins command: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res: any) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * (tokenid:) (action:import|export) (data:) - List, import or export tokens on the chain
 */
type TokensArgsTypes = {
    tokenId?: string
    action?: 'export' | 'import'
    data?: string
}
const tokens = ({ tokenId, action, data }: TokensArgsTypes = {}): Promise<any> => {
    const command = `tokens ` + `${buildArg('tokenId', tokenId)} ` + `${buildArg('action', action)} ` + `${buildArg('data', data)}`

    console.log('tokens command: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res: any) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * (action:list|new) - Get a list of all your public keys or create a new key
 */
const keys = () => {
    throw 'Not yet implemented'
}

/**
 * Get one of your default Minima addresses
 */
const getaddress = () => {
    throw 'Not yet implemented'
}

/**
 * Create a new address that will not be not used for anything else (not a default change address)
 */
const newaddress = (): Promise<any> => {
    const command = `newaddress`
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res: any) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * [address:Mx..|0x..] [amount:] (tokenid:) (state:{}) (burn:) (split:) - Send Minima or Tokens to an address
 */
const send = () => {
    throw 'Not yet implemented'
}

/**
 * (address:) (confirmations:) - Show your total balance of Minima and tokens
 */
type BalanceArgsTypes = {
    address?: string
    confirmations?: number
}
const balance = ({ address, confirmations }: BalanceArgsTypes = {}): Promise<any> => {
    const command = `balance ` + `${buildArg('address', address)} ` + `${buildArg('confirmations', confirmations)}`

    console.log('balance command: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res: any) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * [name:] [amount:] (decimals:) (script:) (state:{}) (signtoken:) (webvalidate:) (burn:) - Create a token. 'name' can be a JSON Object
 */
const tokencreate = () => {
    throw 'Not yet implemented'
}

/**
 * [tokenid:] - validate the signature and web link in a token
 */
const tokenvalidate = () => {
    throw 'Not yet implemented'
}

/**
 * [tokenid:] (coinage:) - Consolidate coins by sending them back to yourself
 */
const consolidate = () => {
    throw 'Not yet implemented'
}

/**
 * [data:] (type:keccak|sha2|sha3)- Hash the data - default KECCAK
 */
const hash = () => {
    throw 'Not yet implemented'
}

/**
 * (size:) - Generate a random hash value, defaults to 32 bytes
 */
const random = () => {
    throw 'Not yet implemented'
}

/**
 * (address:) - Search scripts / addresses
 */
const scripts = () => {
    throw 'Not yet implemented'
}

/**
 * [script:] (track:true|false) - Add a new custom script to track
 */
const newscript = () => {
    throw 'Not yet implemented'
}

/**
 * [script:] (clean:true|false) (state:{}) (prevstate:{}) (globals:{}) (signatures:[]) (extrascripts:{}) - Run a script with the defined parameters
 */
const runscript = () => {
    throw 'Not yet implemented'
}

/**
 * Show the complete Grammar for Minima KISSVM scripting
 */
const tutorial = () => {
    throw 'Not yet implemented'
}

/**
 * [nodes:[]] - Create an MMR Tree of data. Nodes can be STRING / HEX
 */
const mmrcreate = () => {
    throw 'Not yet implemented'
}

/**
 * [data:] [proof:] [root:] - Check an MMR proof
 */
const mmrproof = () => {
    throw 'Not yet implemented'
}

/**
 * [data:] (track:false) - Import a coin, and keep tracking it
 */
const coinimport = () => {
    throw 'Not yet implemented'
}

/**
 * [coinid:] - Export a coin
 */
const coinexport = () => {
    throw 'Not yet implemented'
}

/**
 * [enable:true|false] [coinid:] - Track or untrack a coin
 */
const cointrack = () => {
    throw 'Not yet implemented'
}

/**
 * [publickey:] [data:] - Sign the data with the publickey
 */
const sign = () => {
    throw 'Not yet implemented'
}

/**
 * [publickey:] [data:] [signature:] - Verify a signature
 */
const verify = () => {
    throw 'Not yet implemented'
}

/**
 * (id:) - List current custom transactions
 */
const txnlist = () => {
    throw 'Not yet implemented'
}

/**
 * [id:] - Create a transaction
 */
type TxnCreateArgsTypes = {
    id: string
}
const txncreate = ({ id }: TxnCreateArgsTypes): Promise<any> => {
    const command = `txncreate ` + `${buildArg('id', id)}`
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * [id:] - Automatically set the MMR proofs and scripts for a txn
 */
const txnbasics = () => {
    throw 'Not yet implemented'
}

/**
 * [id:] - Delete this custom transaction
 */
const txndelete = () => {
    throw 'Not yet implemented'
}

/**
 * [id:] - Show details about the transaction
 */
type TxnCheckArgsTypes = {
    id: string
}
const txncheck = ({ id }: TxnCheckArgsTypes): Promise<any> => {
    const command = `txncheck ` + `${buildArg('id', id)}`
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status && checkResponseValidity(res.response)) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })

    function checkResponseValidity(responseObject: any) {
        return (
            responseObject.validamounts &&
            responseObject.valid.basic &&
            responseObject.valid.mmrproofs &&
            responseObject.valid.scripts &&
            responseObject.valid.signatures
        )
    }
}

/**
 * [id:] (coinid:) (coindata:) (floating:) (address:) (amount:) (tokenid:) (sciptmmr:true)- Add a coin as an input to a transaction
 */
type TxnInputArgsTypes = {
    id: string
    coinid?: string
    coindata?: string
    floating?: string // TODO: check this arg type
    address?: string
    amount?: Decimal
    tokenid?: string
    scriptmmr?: true
}
const txninput = ({ id, coinid, coindata, floating, address, amount, tokenid, scriptmmr }: TxnInputArgsTypes): Promise<any> => {
    const command =
        `txninput ` +
        `${buildArg('id', id)} ` +
        `${buildArg('coinid', coinid)} ` +
        `${buildArg('coindata', coindata)} ` +
        `${buildArg('floating', floating)} ` +
        `${buildArg('address', address)} ` +
        `${buildArg('amount', amount)} ` +
        `${buildArg('tokenid', tokenid)} ` +
        `${buildArg('scriptmmr', scriptmmr)}`

    console.log('txninput command: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res: any) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * [id:] [amount:] [address:] (tokenid:) (storestate:) - Create a transaction output
 */
type TxnOutputArgsTypes = {
    id: string
    amount: Decimal
    address: string
    tokenId?: string
    storeState?: string // TODO: check this arg type
}
const txnoutput = ({ id, amount, address, tokenId, storeState }: TxnOutputArgsTypes): Promise<any> => {
    const command =
        `txnoutput ` +
        `${buildArg('id', id)} ` +
        `${buildArg('amount', amount)} ` +
        `${buildArg('address', address)} ` +
        `${buildArg('tokenId', tokenId)} ` +
        `${buildArg('storeState', storeState)}`

    console.log('txnoutput command: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res: any) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * [id:] [port:] [value:] - Add a state variable
 */
const txnstate = () => {
    throw 'Not yet implemented'
}

/**
 * [id:] [scripts:{}] - Add scripts to a txn
 */
const txnscript = () => {
    throw 'Not yet implemented'
}

/**
 * [id:] [publickey:0x..|auto] - Sign a transaction
 */
type TxnSignArgsTypes = {
    id: string
    publicKey: string | 'auto'
}
const txnsign = ({ id, publicKey }: TxnSignArgsTypes): Promise<any> => {
    const command = `txnsign ` + `${buildArg('id', id)} ` + `${buildArg('publicKey', publicKey)}`

    console.log('txnsign command: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * [id:] - Clear ALL the Witness data
 */
const txnclear = () => {
    throw 'Not yet implemented'
}

/**
 * [id:] (auto:true) (burn:) - Post a transaction. Automatically set the Scripts and MMR
 */
type TxnPostArgs = {
    id: string
    auto?: boolean
    burn?: string // TODO: check arg type
}
const txnpost = ({ id, auto, burn }: TxnPostArgs): Promise<any> => {
    const command = `txnpost ` + `${buildArg('id', id)} ` + `${buildArg('auto', auto)} ` + `${buildArg('burn', burn)}`

    console.log('txnpost command: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * (id:) (file:) (data:) - Import a transaction as a file or HEX data. Optionally specify the ID
 */
type TxnImportArgsTypes = {
    id?: string
    file?: string
    data?: string
}
const txnimport = ({ id, file, data }: TxnImportArgsTypes): Promise<any> => {
    const command = `txnimport ` + `${buildArg('id', id)} ` + `${buildArg('file', file)} ` + `${buildArg('data', data)}`

    console.log('txnimport command: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * [id:] (file:) - Export a transaction as HEX or to a file
 */
type TxnExportArgsTypes = {
    id: string
    file?: string
}
const txnexport = ({ id, file }: TxnExportArgsTypes): Promise<any> => {
    const command = `txnexport ` + `${buildArg('id', id)} ` + `${buildArg('file', file)}`

    console.log('txnexport command: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * (action:list|restart) - Show network status or restart
 */
const network = () => {
    throw 'Not yet implemented'
}

/**
 * [action:info|setname|hosts|send|refresh] (name:) (id:)|(to:)|(publickey:) (application:) (data:) (logs:true|false) - Check your Maxima details, send a message / data, enable logs
 */
type MaximaArgsTypes = {
    action?: 'info' | 'setname' | 'hosts' | 'send' | 'refresh'
    name?: string
    id?: number
    to?: string
    publickey?: string
    application?: string
    data?: string
    logs?: boolean
}
const maxima = ({ action, name, id, to, publickey, application, data, logs }: MaximaArgsTypes = {}): Promise<any> => {
    const command =
        `maxima ` +
        `${buildArg('action', action)} ` +
        `${buildArg('name', name)} ` +
        `${buildArg('id', id)} ` +
        `${buildArg('to', to)} ` +
        `${buildArg('publickey', publickey)} ` +
        `${buildArg('application', application)} ` +
        `${buildArg('data', data)} ` +
        `${buildArg('logs', logs)}`

    console.log('maxima command: ', command)
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (res: any) => {
            if (res.status) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * [action:list|mls|add|remove|search] (contact:) (id:) (publickey:) - Manage your Maxima contacts
 */
const maxcontacts = () => {
    throw 'Not yet implemented'
}

/**
 * (uid:uid) [data:message] - Send a message over the network to one of your direct peers
 */
const message = () => {
    throw 'Not yet implemented'
}

/**
 * [host:ip:port] - Connect to a network Minima instance
 */
const connect = () => {
    throw 'Not yet implemented'
}

/**
 * [uid:uid] - Disconnect from a connected or connecting host
 */
const disconnect = () => {
    throw 'Not yet implemented'
}

/**
 * [enable:true|false] - Enable and disable RPC on port 9002 (default is off)
 */
const rpc = () => {
    throw 'Not yet implemented'
}

/**
 * (action:list|add|remove|clear) (hook:url) - Add a web hook that is called with Minima events as they happen
 */
const webhooks = () => {
    throw 'Not yet implemented'
}

/**
 * (action:list|install|uninstall) (file:) (uid:) - MiniDAPP System management
 */
const mds = () => {
    throw 'Not yet implemented'
}

/**
 * (file:) (complete:false|true) - Backup the system. Uses a timestamped name by default
 */
const backup = () => {
    throw 'Not yet implemented'
}

/**
 * [file:] - Restore the entire system.
 */
const restore = () => {
    throw 'Not yet implemented'
}

/**
 * [action:seed|lock|unlock] (seed:) - BE CAREFUL. Wipe / Restore your private keys
 */
const vault = () => {
    throw 'Not yet implemented'
}

/**
 * (uid:) - Show your rewards or specify your UserID for the Incentive Cash program
 */
const incentivecash = () => {
    throw 'Not yet implemented'
}

/**
 * Shutdown Minima
 */
const quit = () => {
    throw 'Not yet implemented'
}

////////////// helpers ////////////////////////

// if prop value is undefined returns an empy string ''
// otherwise returns the name, value pair as a string
// eg 'tokenid:0xA39FCDC0593B9FAB6E194D758B2ADC67DA7416EB01224F873C519C5A90C24AFF'
// or 'amount:10'
function buildArg(propName: string, propValue: any) {
    if (propValue === undefined) {
        return ''
    } else {
        return `${propName.toLowerCase()}:${propValue.toString()}`
    }
}

///////////// api ////////////////////

export const commands = {
    help,
    status,
    printtree,
    burn,
    trace,
    hashtest,
    txpow,
    coins,
    tokens,
    keys,
    getaddress,
    newaddress,
    send,
    balance,
    tokencreate,
    tokenvalidate,
    consolidate,
    hash,
    random,
    scripts,
    newscript,
    runscript,
    tutorial,
    mmrcreate,
    mmrproof,
    coinimport,
    coinexport,
    cointrack,
    sign,
    verify,
    txnlist,
    txncreate,
    txnbasics,
    txndelete,
    txncheck,
    txninput,
    txnoutput,
    txnstate,
    txnscript,
    txnsign,
    txnclear,
    txnpost,
    txnimport,
    txnexport,
    network,
    maxima,
    maxcontacts,
    message,
    connect,
    disconnect,
    rpc,
    webhooks,
    mds,
    backup,
    restore,
    vault,
    incentivecash,
    quit,
}

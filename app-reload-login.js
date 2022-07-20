const { exec } = require('child_process')
const axios = require('axios')
const https = require('https')
const xpath = require('xpath')
const DOMParser = require('xmldom').DOMParser


/////////////// zip file name as command line agrs //////////////

console.log(process.argv)
if (process.argv.length < 3) {
    throw 'missing new minidapp filename'
}
const newZipFileName = process.argv[2]
const newZipFilePath = __dirname + '/' + newZipFileName
console.log('loading zip from ' + newZipFilePath)


////////////////// minima rpc port as command line args /////////////

// default rpc port is 9002
if (process.argv.length < 4) {
    throw 'missing RPC port number'
}
const rpcPort = process.argv[3]
const minimaRpcUrl = `http://127.0.0.1:${rpcPort}`
const mdsPort = (parseInt(rpcPort) + 1).toString()
const mdsUrl = `https://127.0.0.1:${mdsPort}`
console.log('minimaRpcUrl', minimaRpcUrl)
console.log('mdsUrl', mdsUrl)


//////////////// functions /////////////////////

const callMinimaCommand = (command) => {
    console.log('running command ' + command)
    const encoded = encodeURIComponent(command)
    const url = `${minimaRpcUrl}/${encoded}`
    return axios
        .get(url)
        .then((res) => {
            if (res.status === 200) {
                return res.data.response
            } else {
                console.error(res.status)
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

const getInstalledMinidapps = () => {
    return callMinimaCommand('mds').then((response) => {
        console.log('All minidapp instances', response.minidapps)
        return response.minidapps
    })
}

const getMinidappPassword = () => {
    return callMinimaCommand('mds').then((response) => {
        const password = response.password
        console.log('password', password)
        return password
    })
}

const getInstalledNftMinidappInstances = () => {
    console.log('getInstalledNftMinidappInstances')
    return getInstalledMinidapps().then((minidapps) => {
        return minidapps.filter((minidapp) => minidapp.conf.name === 'nft-off-chain')
    })
}

const installMinidapp = (minidappPath) => () => {
    console.log('installMinidapp')
    return callMinimaCommand(`mds action:install file:${minidappPath}`).then(console.log)
}

const uninstallAppInstance = (uid) => {
    console.log('uninstallAppInstance')
    return callMinimaCommand(`mds action:uninstall uid:${uid}`).then(console.log)
}

const uninstallAllNftInstances = () => {
    console.log('uninstallAllNftInstances')
    return getInstalledNftMinidappInstances().then((instances) => {
        console.log('NFT instances', instances)
        const promises = instances.map((instance) => uninstallAppInstance(instance.uid))
        return Promise.all(promises)
    })
}

const getMiniHubHTML = (password) => {
    const url = mdsUrl + '/login.html'
    const httpsAgent = new https.Agent({ rejectUnauthorized: false })

    const request = {
        method: 'post',
        url,
        data: `password=${password}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        httpsAgent,
    }

    return axios(request).then((res) => res.data)
}

const extractLastInstalledMinidappUrl = (miniHubHTML) => {
    console.log('miniHubHTML', miniHubHTML)
    const miniHubDoc = new DOMParser().parseFromString(miniHubHTML)

    // gets link from the last li in the list of installed minidapps
    const xPathString = 'string(//ul//*[last()][name()="li"]//a/@href)'

    var minidappHref = xpath.select(xPathString, miniHubDoc)

    console.log('minidappHref', minidappHref)
    // take off first dot and add to https://127.0.0.1:9003
    const fullUrl = mdsUrl + minidappHref.substring(1)
    return fullUrl
}

const extractAllInstalledMinidappUrls = (miniHubHTML) => {
    console.log('miniHubHTML', miniHubHTML)
    const miniHubDoc = new DOMParser().parseFromString(miniHubHTML)

    // gets an array of hrefs from all installed minidapps
    const xPathString = '//ul//li//a/@href'

    var minidappHrefs = xpath.select(xPathString, miniHubDoc)
    allMinidapUrls = minidappHrefs.map((href) => {
        // take off first dot and add to https://127.0.0.1:9003
        return mdsUrl + href.nodeValue.substring(1)
    })
    console.log('allMinidapUrls', allMinidapUrls)

    return allMinidapUrls
}

const openMinidappInChrome = (minidappFullUrl) => {
    console.log('minidappFullUrl', minidappFullUrl)
    exec(`chromium ${minidappFullUrl}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`)
            return
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`)
            return
        }
        console.log(`stdout: ${stdout}`)
    })
}

//////////////// main /////////////////////

uninstallAllNftInstances()
    .then(installMinidapp(newZipFilePath))
    .then(getMinidappPassword)
    .then(getMiniHubHTML)
    .then(extractAllInstalledMinidappUrls)
    .then((urlsArray) => {
        urlsArray.forEach(openMinidappInChrome)
    })

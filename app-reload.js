const { exec } = require('child_process')
const axios = require('axios')

const minimaRpcUrl = 'http://127.0.0.1:9002'

console.log(process.argv)

const newZipFileName = process.argv[2]
const newZipFilePath = __dirname + '/' + newZipFileName

console.log('loading zip from ' + newZipFilePath)

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
        return response.minidapps
    })
}

const getInstalledNftMinidappInstances = () => {
    console.log('getInstalledNftMinidappInstances')
    return getInstalledMinidapps().then((minidapps) => {
        return minidapps.filter((minidapp) => minidapp.name === 'nft-off-chain')
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
        const promises = instances.map((instance) => uninstallAppInstance(instance.uid))
        return Promise.all(promises)
    })
}

const openMinidappInChrome = (uid) => {
    exec(`chromium http://localhost:9003/${uid}/index.html`, (error, stdout, stderr) => {
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

/**
 * Unload old instances
 * Load new instance into mds
 * Open new instance in Chrome
 */
uninstallAllNftInstances()
    .then(installMinidapp(newZipFilePath))
    .then(getInstalledNftMinidappInstances)
    .then((installed) => {
        console.log('final installed minidapp', installed)
        // there should only be 1, return the uid of the first
        return installed[0].uid
    })
    .then(openMinidappInChrome)

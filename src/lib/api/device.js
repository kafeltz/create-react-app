import BASE_URL from './base-url.js'

function getDevices() {
    const url = `${BASE_URL}/device`
    const method = 'GET'

    const headers = new Headers()
    headers.append('Content-Type', 'application/json;charset=UTF-8')

    const params = {
        headers: headers,
        method: method,
    }

    // return fetch(url, params).then(response => response.json())
    return fetch(url, params).then(response => {
        return [{
                "address": "http://192.168.0.31:8100"
            },
            {
                "address": "http://0.0.0.0:8100"
            },
        ]
    })
}

function setDevice(address) {
    const url = `${BASE_URL}/device`
    const method = 'POST'
    const headers = new Headers()
    const payload = {
        address: address,
    }
    const json = JSON.stringify(payload)

    headers.append('Content-Type', 'application/json;charset=UTF-8')

    const params = {
        body: json,
        headers: headers,
        method: method,
    }

    return fetch(url, params)
}

function getDeviceStatus() {
    const url = `${BASE_URL}/device/status`
    const method = 'GET'
    const headers = new Headers()

    headers.append('Content-Type', 'application/json;charset=UTF-8')

    const params = {
        headers: headers,
        method: method,
    }

    return fetch(url, params)
}

function getDevicesInfo() {
    const url = `${BASE_URL}/device/info`
    const method = 'GET'
    const headers = new Headers()

    headers.append('Content-Type', 'application/json;charset=UTF-8')

    const params = {
        headers: headers,
        method: method,
    }

    return fetch(url, params)
}

export {
    getDeviceStatus,
    getDevices,
    getDevicesInfo,
    setDevice,
}

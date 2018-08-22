import BASE_URL from './base-url.js'

function getDevices() {
    const url = `${BASE_URL}/device`
    const method = 'GET'

    const headers = new Headers()
    headers.append('content-type', 'application/json;charset=UTF-8')

    const params = {
        headers: headers,
        method: method,
    }

    return fetch(url, params).then(response => response.json())
}

function setStreamingDevice() {
}

function getCurrentDeviceStatus() {
}

function getDevicesInfo() {
    const url = `${BASE_URL}/device/info`
    const method = 'GET'
    const headers = new Headers()

    headers.append('content-type', 'application/json;charset=UTF-8')

    const params = {
        headers: headers,
        method: method,
    }

    return fetch(url, params)
}

export {
    getCurrentDeviceStatus,
    getDevices,
    getDevicesInfo,
    setStreamingDevice,
}

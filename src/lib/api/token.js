import BASE_URL from './base-url.js'

function getTokenStatus() {
    const url = `${BASE_URL}/token/status`
    const method = 'GET'

    const headers = new Headers()
    headers.append('Content-Type', 'application/json;charset=UTF-8')

    const params = {
        headers: headers,
        method: method,
    }

    return fetch(url, params)
}

function setToken(token) {
    const url = `${BASE_URL}/token`
    const method = 'POST'
    const headers = new Headers()
    const payload = {
        token: token,
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

export {
    setToken,
    getTokenStatus,
}

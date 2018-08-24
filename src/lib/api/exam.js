import moment from 'moment'
import guid from '../guid.js'
import BASE_URL from './base-url.js'

function getExams() {
    const url = `${BASE_URL}/exam`
    const method = 'GET'

    const headers = new Headers()
    headers.append('content-type', 'application/json;charset=UTF-8')

    const params = {
        headers: headers,
        method: method,
    }

    return fetch(url, params).then(response => response.json())
}

function saveExam({ patientName, datetime, phones, emails }) {
    const url = `${BASE_URL}/exam`
    const method = 'POST'
    const headers = new Headers()
    const payload = {
        emails: emails,
        id: guid(),
        patient: patientName,
        phones: phones,
        scheduled: moment(datetime).toISOString(),
    }
    const json = JSON.stringify(payload)

    headers.append('content-type', 'application/json;charset=UTF-8')

    const params = {
        body: json,
        headers: headers,
        method: method,
    }

    return fetch(url, params)
}

function startExam(examId) {
    const url = `${BASE_URL}/exam/${examId}/start`
    const method = 'POST'
    const headers = new Headers()

    headers.append('content-type', 'application/json;charset=UTF-8')

    const params = {
        headers: headers,
        method: method,
    }

    return fetch(url, params)
}

function stopExam(examId) {
    const url = `${BASE_URL}/exam/${examId}/stop`
    const method = 'POST'
    const headers = new Headers()

    headers.append('content-type', 'application/json;charset=UTF-8')

    const params = {
        headers: headers,
        method: method,
    }

    return fetch(url, params)
}

function disableExam(examId) {
    const url = `${BASE_URL}/exam/${examId}/disable`
    const method = 'POST'
    const headers = new Headers()

    headers.append('content-type', 'application/json;charset=UTF-8')

    const params = {
        headers: headers,
        method: method,
    }

    return fetch(url, params)
}

function getExamRunning() {
    const url = `${BASE_URL}/exam/running`
    const method = 'GET'
    const headers = new Headers()

    headers.append('content-type', 'application/json;charset=UTF-8')

    const params = {
        headers: headers,
        method: method,
    }

    return fetch(url, params)
}

function notifyExam(examId) {
    const url = `${BASE_URL}/exam/${examId}/notify`
    const method = 'POST'
    const headers = new Headers()

    headers.append('content-type', 'application/json;charset=UTF-8')

    const params = {
        headers: headers,
        method: method,
    }

    return fetch(url, params)
}

export {
    disableExam,
    getExamRunning,
    getExams,
    notifyExam,
    saveExam,
    startExam,
    stopExam,
}

import moment from 'moment'
import guid from './guid.js'

const BASE_URL = '//localhost:8080/v1'
// const BASE_URL = '//192.168.1.111:8080/v1'

export const ALREADY_DISABLED = 'ALREADY_DISABLED'
export const ALREADY_STARTED = 'ALREADY_STARTED'
export const ALREADY_STOPPED = 'ALREADY_STOPPED'
export const CONTACT_REQUIRED = 'CONTACT_REQUIRED'
export const INVALID_FORMAT = 'INVALID_FORMAT'
export const INVALID_PAYLOAD = 'INVALID_PAYLOAD'
export const METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED'
export const NEED_BE_IN_FUTURE = 'NEED_BE_IN_FUTURE'
export const NOT_FOUND = 'NOT_FOUND'
export const NOT_NULL = 'NOT_NULL'
export const NOT_STARTED = 'NOT_STARTED'


// Retorna todos os exames cadastrados
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

// Cadastra novo exame
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

// Inicia um novo exame
function startExam(examId) {
    const url = `${BASE_URL}/exam/${examId}/start`
    const method = 'POST'
    const headers = new Headers()

    const params = {
        headers: headers,
        method: method,
    }

    return fetch(url, params)
}

// Finaliza o exame
// Arquiva o exame
// Reenvia dados do exame



export {
    saveExam,
    getExams,
    startExam,
}


import toApiDate from './to-api-date.js'
import guid from './guid.js'

const BASE_URL = '//localhost:8080/v1'

// Retorna todos os exames cadastrados
function getExams({ after = '', before = '', email = '', enable = true, limit = '', pacientName = '', page = 1, phone = '' }) {
    const url = `${BASE_URL}/exam`
    const method = 'GET'
    const payload = {
        after: after,
        before: before,
        email: email,
        enable: enable,
        limit: limit,
        pacient_name: pacientName,
        page: page,
        phone: phone,
    }
    const json = JSON.stringify(payload)

    const headers = new Headers()
    headers.append('content-type', 'application/json;charset=UTF-8')

    const params = {
        body: json,
        headers: headers,
        method: method,
    }

    return fetch(url, params)
}

// Cadastra novo exame
function saveExam({ pacientName, datetime, phones, emails }) {
    const url = `${BASE_URL}/exam`
    const method = 'POST'
    const headers = new Headers()
    const payload = {
        datetime: datetime,
        emails: emails,
        id: guid(),
        pacient: pacientName,
        phones: phones,
        scheduled_at: toApiDate(datetime),
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



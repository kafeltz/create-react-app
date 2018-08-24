import EventEmitter from 'events'

const API_ERROR = 'API_ERROR'
const API_EXCEPTION = 'API_EXCEPTION'
const SNACK_ERROR = 'SNACK_ERROR'
const SNACK_SUCCESS = 'SNACK_SUCCESS'

const events = new EventEmitter()

export {
    API_ERROR,
    API_EXCEPTION,
    SNACK_ERROR,
    SNACK_SUCCESS,
    events,
}

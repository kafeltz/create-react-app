import EventEmitter from 'events'

const API_ERROR = 'API_ERROR'
const SNACK_SUCCESS = 'SNACK_SUCCESS'
const SNACK_ERROR = 'SNACK_ERROR'

const events = new EventEmitter()

export {
    events,
    API_ERROR,
    SNACK_SUCCESS,
    SNACK_ERROR,
}

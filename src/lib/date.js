import moment from 'moment'

// from: 2009-11-10T23:00:00.000Z
// to: dd/mm/aaaa hh:mm
const toDate = function(datetime) {
    const regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/

    if (datetime.match(regex) !== null) {
        return moment(datetime).format('DD/MM/YYYY HH:mm')
    } else {
        return false
    }
}

// from: dd/mm/aaaa hh:mm
// to: 2009-11-10T23:00:00.000Z
const toIsoDate = function(datetime) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/
    const match = datetime.match(regex)

    if (match !== null) {
        // de `dd/mm/yyyy hh:mm` para `yyyy-mm-dd hh:mm` pois é um formato que o momentjs entende
        let date = datetime.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, '$3-$2-$1 $4:$5')

        return moment(date).toISOString()
    } else {
        return false
    }
}

export {
    toDate,
    toIsoDate,
}

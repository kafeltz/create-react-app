// from: dd/mm/yyyy hh:mm
// to: yyyy-mm-dd hh:mm:00
const toApiDate = function(datetime) {
    return datetime.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:00')
}

export default toApiDate

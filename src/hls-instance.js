import Hls from 'hls.js'
import EventEmitter from 'events'

const hls = new Hls()
const events = new EventEmitter()

hls.on(Hls.Events.MANIFEST_PARSED, () => {
    events.emit('MANIFEST_PARSED')
})

let sourceLoaded = false
function loadSource(source) {
    if (!sourceLoaded) {
        hls.loadSource(source)
    }

    sourceLoaded = true
}

function attachMedia(dom) {
    hls.detachMedia()

    hls.attachMedia(dom)
}

function detachMedia() {
    hls.detachMedia()
}

export {
    attachMedia,
    detachMedia,
    loadSource,
    events,
}

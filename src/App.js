import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import PageConfig from './page-config.js'
import PageDashboard from './page-dashboard.js'
import PageDevice from './page-device.js'
import PageHome from './page-home.js'
import PageNewExam from './page-new-exam.js'
import PagePlaygrounds from './page-playgrounds.js'
import PageToken from './page-token.js'
import PageTransmission from './page-transmission.js'

import Player from './component-player.js'
import Snack from './component-snack.js'

import {
    attachMedia,
    detachMedia,
} from './hls-instance.js'

import { getDevicesInfo } from './lib/api/device.js'
import { getTokenStatus } from './lib/api/token.js'
import { getExams } from './lib/api/exam.js'


import {
    API_ERROR,
    events as appEvents,
    SNACK_SUCCESS,
} from './events.js'

import './App.css'
import 'typeface-roboto'


const theme = createMuiTheme({
    overrides: {
        MuiButton: {
            containedSecondary: {
                color: 'white',
            },
            textPrimary: {
                color: '#006fb6',
            },
        },
        MuiAppBar: {
            colorDefault: {
                backgroundColor: 'white',
                borderBottom: '1px solid #e0e0e0',
                boxShadow: 'unset',
            }
        },
    },
    palette: {
        primary: {
            main: '#00AEEF',
        },
        secondary: {
            main: '#00CF74',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
})

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // indica que o dom <video> foi anexado ao hls, usado pra evitar play() em cima de play() (re-rendering) e dar erro no navegador/hls
            attached: false,
            // dependendo da sub-página da app, não é pra renderizar o player mesmo se estiver transmitindo, quem
            // informa se pode ou não é a sub-página para a página pai através de eventos
            canRenderFloatPlayer: false,
            devices: [],
            examIdTransmitting: '',
            exams: [],
            isTransmitting: false,
            playerIsReadyToPlay: false,
            playerOpen: false,
            snackbarOpen: false,
            snackbarMessage: '',
            tokenIsValid: false,
            tokenOk: null, // null, true or false
        }

        this.videoDom = null
        this.router = React.createRef()

        getTokenStatus()
            .then(response => {
                switch(response.status) {
                    case 200:
                        this.setState({ tokenOk: true })
                        break

                    case 401:
                    case 404:
                    default:
                        this.setState({ tokenOk: false })
                        this.router.current.history.push('/token')
                }
            })

        appEvents.on('TRANSMISSION_STARTED', ({ examId, deviceM3U8 }) => {
            this.setState({
                deviceM3U8: deviceM3U8,
                examIdTransmitting: examId,
                isTransmitting: true,
            })

            getExams().then(data => this.setState({ exams: data }))
        })

        appEvents.on('TRANSMISSION_STOPPED', () => {
            this.setState({
                examIdTransmitting: '',
                isTransmitting: false,
            })
        })

        appEvents.on('CAN_RENDER_FLOAT_PLAYER', can => {
            this.setState({ canRenderFloatPlayer: can })

            if (!can) {
                this.setState({ attached: false })
            }
        })

        appEvents.on(API_ERROR, context => {
            this.setState({
                snackbarMessage: 'Ocorreu um erro inesperado',
                snackbarOpen: true,
                snackbarType: 'error',
            })

            console.error('API_ERROR', context)
        })

        appEvents.on(SNACK_SUCCESS, message => {
            this.setState({
                snackbarMessage: message,
                snackbarOpen: true,
                snackbarType: 'success',
            })
        })

        getDevicesInfo()
            .then(response => {
                if (response.status === 404) {
                    const devices = [{
                        'address': 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
                        'id': 'f0e4fd5e-c3f5-4b13-8591-4099aaecc83d',
                    }]

                    this.setState({ devices: devices })
                }
            })

        this.getVideoDomElement = this.getVideoDomElement.bind(this)
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this)
        this.handlePlayerClick = this.handlePlayerClick.bind(this)
    }

    handleCloseSnackbar() {
        this.setState({ snackbarOpen: false })
    }

    handlePlayerClick() {
        const { examIdTransmitting } = this.state

        this.setState({ playerOpen: false })

        detachMedia()

        this.router.current.history.push(`/transmission/${examIdTransmitting}`)
    }

    getVideoDomElement(instance) {
        const { isTransmitting, canRenderFloatPlayer, attached } = this.state

        this.videoDom = instance

        if (isTransmitting && canRenderFloatPlayer && !attached) {
            attachMedia(this.videoDom)

            this.setState({ attached: true })
        }
    }

    render() {
        const {
            canRenderFloatPlayer,
            examIdTransmitting,
            exams,
            isTransmitting,
            snackbarMessage,
            snackbarOpen,
            snackbarType,
        } = this.state

        let player = (null)

        if (examIdTransmitting) {
            const exam = exams.find(x => x.id === examIdTransmitting)

            if (exam) {
                // pega os dados pelo id do exame que está sendo transmitido
                const examData = {
                    patientEmails: exam['emails'] || [],
                    patientName: exam.patient,
                    patientPhones: exam['phones'] || [],
                    patientScheduled: exam.scheduled,
                }

                player = <Player dom={this.getVideoDomElement} onClick={this.handlePlayerClick} visible={isTransmitting} {...examData} />
            }
        }

        const parentProps = {
            examIdTransmitting,
            isTransmitting,
        }

        return (
            <MuiThemeProvider theme={theme}>
                <Router ref={this.router}>
                    <React.Fragment>
                        <CssBaseline />

                        <Route exact path="/" component={PageHome} />
                        <Route path="/dashboard" render={ props => <PageDashboard route={{...props}} /> } />
                        <Route path="/new-exam"  render={ props => <PageNewExam route={{...props}} /> } />
                        <Route path="/token"     render={ props => <PageToken route={{...props}} /> } />
                        <Route path="/device"    render={ props => <PageDevice route={{...props}} /> } />
                        <Route path="/config" component={PageConfig} />
                        <Route path="/transmission/:id" render={ props => <PageTransmission route={{...props}} parentProps={ {...parentProps} } /> } />

                        <Route path="/playgrounds" component={PagePlaygrounds} />

                        {canRenderFloatPlayer && player}

                        <Snack type={snackbarType} onClose={this.handleCloseSnackbar} snackbarMessage={snackbarMessage} snackbarOpen={snackbarOpen} />
                    </React.Fragment>
                </Router>
            </MuiThemeProvider>
        )
    }
}

export default App

import React from 'react'
import PropTypes from 'prop-types'
import is from 'is_js'
import classnames from 'classnames'
import { Link } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import red from '@material-ui/core/colors/red'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import SvgIcon from '@material-ui/core/SvgIcon'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import yellow from '@material-ui/core/colors/yellow'
import green from '@material-ui/core/colors/green'
import { withStyles } from '@material-ui/core/styles'

import {
    getDevicesInfo,
    getExamRunning,
    getExams,
    startExam,
    stopExam,
} from './lib/api.js'
import Menu from './component-menu.js'
import { toDate } from './lib/date.js'

import {
    events as appEvents,
} from './events.js'

import {
    attachMedia,
    detachMedia,
    events,
    loadSource,
} from './hls-instance.js'

const styles = theme => ({
    appbar: {
        background: 'white',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: 'unset',
    },
    button: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    buttonTransmitting: {
        background: 'red',
    },
    flex: {
        flexGrow: 1,
    },
    grid: {
        padding: theme.spacing.unit * 3,
    },
    paper: {
        padding: theme.spacing.unit * 3,
    },
    paperWarning: {
        padding: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 1,
    },
    pageBusy: {
        opacity: 0.3,
        pointerEvents: 'none',
    },
    player: {
        background: '#000',
        height: 'auto',
        minHeight: 333,
        marginBottom: theme.spacing.unit * 3,
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        width: '100%',
    },
    playerNoDeviceMessage: {
        bottom: 0,
        color: '#fff',
        display: 'block',
        height: 30,
        margin: 'auto',
        position: 'absolute',
        textAlign: 'center',
        top: 0,
        width: '100%',
    },
    snackbarError: {
        backgroundColor: red[600],
    },
    snackbarSuccess: {
        backgroundColor: green[600],
    },
    statusIcon: {
        fontSize: 36,
        marginRight: 5,
    },
    statusIdle: {
        fill: yellow[500],
    },
    statusTransmitting: {
        fill: red[500],
    },
})

class Transmission extends React.Component {
    constructor(props) {
        super(props)

        getDevicesInfo()
            .then(response => {
                // if (response.status === 200) {
                if (response.status === 404) {
                    // const devices = response.json()
                    const devices = [{
                        'address': 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
                        'id': 'f0e4fd5e-c3f5-4b13-8591-4099aaecc83d',
                    }]

                    loadSource(devices[0].address)

                    events.on('MANIFEST_PARSED', () => {
                        console.warn('MANIFEST_PARSED')
                        this.setState({ playing: true })
                    })

                    this.setState({ devices: devices })
                } else if (response.status === 404) {
                }
            })

        this.state = {
            busy: props.parentProps.isTransmitting && props.route.match.params.id === props.parentProps.examIdTransmitting,
            data: [],
            devices: [],
            examIdRunning: '',
            examIdTransmitting: '',
            id: props.route.match.params.id,
            patientEmails: props.patientEmails,
            patientName: props.patientName,
            patientPhones: props.patientPhones,
            patientScheduled: props.patientScheduled,
            playing: false,
            snackbarClass: props.classes.snackbarSuccess,
            snackbarMessage: '',
            snackbarOpen: false,
        }

        getExams().then(data => {
            this.setState({ data: data })

            const exam = data.find(x => x.id === this.state.id)

            if (exam) {
                this.setState({
                    patientEmails: exam.emails,
                    patientName: exam.patient,
                    patientPhones: exam.phones,
                    patientScheduled: exam.scheduled,
                })
            }
        })

        getExamRunning().then(data => {
            const { id } = this.state

            this.setState({ examIdRunning: data.id })

            if (data.id === id) {
                this.setState({ busy: id })
            }
        })

        this.playerDom = React.createRef()

        appEvents.emit('CAN_RENDER_FLOAT_PLAYER', false)

        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this)
        this.handleStartTransmission = this.handleStartTransmission.bind(this)
    }

    componentWillUnmount() {
        // esta tela de transmissão ao ser abandonada (trocar de rota) deve liberar os recursos do player
        // diferente do float player que é compartilhado por várias rotas e não precisa liberar os recursos
        detachMedia()
    }

    handleCloseSnackbar(e, reason) {
        if (reason === 'clickaway') {
            return
        }

        this.setState({ snackbarOpen: false })
    }

    handle409Start() {
        const { snackbarError } = this.props.classes

        this.setState({
            snackbarClass: snackbarError,
            snackbarMessage: 'Não é possível iniciar a transmissão, encerre a outra transmissão primeiro!',
            snackbarOpen: true,
        })
    }

    handle409Stop() {
        const { snackbarError } = this.props.classes

        this.setState({
            snackbarClass: snackbarError,
            snackbarMessage: 'Não é possível finalizar a transmissão!',
            snackbarOpen: true,
        })
    }

    handleStartTransmission(e) {
        e.stopPropagation()

        const {
            id,
            busy,
        } = this.state

        if (busy) {
            stopExam(id)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ snackbarMessage: 'Transmissão gravada!', snackbarOpen: true, })
                        appEvents.emit('TRANSMISSION_STOPPED')
                    } else if (response.status === 400) {
                    } else if (response.status === 404) {
                    } else if (response.status === 409) {
                        this.handle409Stop()
                    }

                    return response
                })
                .then(() => this.setState({ busy: false }))

        } else {
            this.setState({ busy: true })

            startExam(id)
                .then(response => {
                    if (response.status === 200) {
                        appEvents.emit('TRANSMISSION_STARTED', {
                            deviceM3U8: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
                            examId: id,
                        })
                    } else if (response.status === 400) {
                    } else if (response.status === 404) {
                    } else if (response.status === 409) {
                        this.handle409Start()
                        this.setState({ busy: false })
                    }

                    return response
                })
        }
    }

    render() {
        const {
            classes,
        } = this.props

        const {
            examIdRunning,
            busy,
            devices,
            id,
            patientEmails,
            patientName,
            patientPhones,
            patientScheduled,
            snackbarClass,
            snackbarMessage,
            snackbarOpen,
        } = this.state

        attachMedia(this.playerDom.current)

        const player = () => {
            if (is.empty(devices)) {
                return (
                    <div className={classes.player}>
                        <Typography variant="subheading" className={classes.playerNoDeviceMessage}>Dispositivo de transmissão não encontrado!</Typography>
                    </div>
                )
            } else {
                return (
                    <video ref={this.playerDom} className={classes.player} muted autoPlay />
                )
            }
        }

        const buttonLabel = busy ? 'Finalizar transmissão' : 'Iniciar transmissão'

        const emails = is.empty(patientEmails) ? 'Não cadastrado' : patientEmails.join(', ')
        const phones = is.empty(patientPhones) || (patientPhones.length === 1 && patientPhones[0] === '') ? 'Não cadastrado' : patientPhones.join(', ')

        const isThereexamIdRunning = !is.empty(examIdRunning) && examIdRunning !== id

        const disableTransmissitionButton = is.empty(devices)

        return (
            <div>
                <Snackbar
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleCloseSnackbar}
                >
                    <SnackbarContent
                        className={snackbarClass}
                        message={snackbarMessage}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                onClick={this.handleCloseSnackbar}
                            >
                                <CloseIcon />
                            </IconButton>,
                        ]}
                    />
                </Snackbar>

                <Grid container>
                    <Grid item xs={2}>
                        <Menu />
                    </Grid>

                    <Grid item xs={10}>
                        <AppBar position="static" className={classes.appbar}>
                            <Toolbar>
                                <div className={classes.flex}>
                                    <Typography variant="title">
                                        {patientName}
                                    </Typography>
                                </div>

                                <SvgIcon className={classes.statusIcon}>
                                    <FiberManualRecordIcon className={classnames({ [classes.statusIdle]: !busy }, { [classes.statusTransmitting]: busy })} />
                                </SvgIcon>

                                <Button
                                    className={classes.button}
                                    color="secondary"
                                    onClick={this.handleStartTransmission}
                                    variant="contained"
                                    disabled={disableTransmissitionButton}
                                >
                                    {buttonLabel}
                                </Button>
                            </Toolbar>
                        </AppBar>

                        <Grid container className={classes.grid} justify="center">
                            <Grid item lg={5} md={10} sm={12}>
                                {isThereexamIdRunning && (
                                    <Paper className={classes.paperWarning}>
                                        <Typography color="error">
                                            Está sendo transmitido um exame, você deve primeiro finalizá-lo.

                                            <Button
                                                component={Link}
                                                to={`/transmission/${examIdRunning}`}
                                                className={classes.button}
                                                color="primary"
                                                onClick={e => document.location.reload()}
                                            >
                                                Abrir exame
                                            </Button>

                                        </Typography>
                                    </Paper>
                                )}

                                <Paper className={classes.paper}>
                                    {player()}

                                    <Typography variant="body2">Data e hora</Typography>
                                    <Typography variant="body1" paragraph={true}>{toDate(patientScheduled)}</Typography>

                                    <Typography variant="body2">E-mail</Typography>
                                    <Typography variant="body1" paragraph={true}>{emails}</Typography>

                                    <Typography variant="body2">Telefone</Typography>
                                    <Typography variant="body1" paragraph={true}>{phones}</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

Transmission.propTypes = {
    busy: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    parentProps: PropTypes.shape({
        examIdTransmitting: PropTypes.string.isRequired,
        isTransmitting: PropTypes.bool.isRequired,
    }),
    patientEmails: PropTypes.arrayOf(PropTypes.string),
    patientName: PropTypes.string,
    patientPhones: PropTypes.arrayOf(PropTypes.string),
}

Transmission.defaultProps = {
    busy: false,
    patientEmails: [],
    patientName: 'Paciente',
    patientPhones: [],
}

export default withStyles(styles)(Transmission)

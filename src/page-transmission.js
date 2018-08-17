import React from 'react'
import PropTypes from 'prop-types'
import is from 'is_js'
import Hls from 'hls.js'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import SvgIcon from '@material-ui/core/SvgIcon'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'

import classnames from 'classnames'

import red from '@material-ui/core/colors/red'
import yellow from '@material-ui/core/colors/yellow'

import { Link } from 'react-router-dom'

import {
    getDevicesInfo,
    getExams,
    startExam,
    stopExam,
} from './lib/api.js'

import { toDate } from './lib/date.js'

import Menu from './component-menu.js'

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

const hls = new Hls()

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

                    hls.loadSource(devices[0].address)

                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        this.setState({ playing: true })
                    })

                    this.setState({ devices: devices })
                } else if (response.status === 404) {
                }
            })

        this.state = {
            anotherExamRunning: '',
            busy: false,
            data: [],
            devices: [],
            id: props.route.match.params.id,
            patientEmails: props.patientEmails,
            patientName: props.patientName,
            patientPhones: props.patientPhones,
            patientScheduled: props.patientScheduled,
            playing: false,
        }

        getExams().then(data => {
            this.setState({ data: data })

            const exam = data.find(x => x.id === this.state.id)

            const anotherExamRunning = data.find(x => x.id !== this.state.id && x.running)

            if (anotherExamRunning) {
                this.setState({
                    anotherExamRunning: anotherExamRunning.id,
                })
            }

            if (exam) {
                this.setState({
                    // patientEmails: exam.emails,
                    patientEmails: ['abc@abc.com', 'xyz@xyz.com'],
                    patientName: exam.patient,
                    //patientPhones: exam.phones,
                    patientPhones: ['(47) 98877-6655'],
                    patientScheduled: exam.scheduled,
                })
            }
        })

        this.playerDom = React.createRef()

        this.attached = false

        this.handleStartTransmission = this.handleStartTransmission.bind(this)
    }

    handleStartTransmission(e) {
        e.stopPropagation()

        const {
            id,
            busy,
        } = this.state

        if (busy) {
            this.setState({ busy: false })

            stopExam(id)
                .then(response => {
                    if (response.status === 200) {
                    } else if (response.status === 400) {
                    } else if (response.status === 404) {
                    } else if (response.status === 409) {
                    }

                    return response
                })
        } else {
            this.setState({ busy: true })

            startExam(id)
                .then(response => {
                    if (response.status === 200) {
                    } else if (response.status === 400) {
                    } else if (response.status === 404) {
                    } else if (response.status === 409) {
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
            anotherExamRunning,
            busy,
            devices,
            patientEmails,
            patientName,
            patientPhones,
            patientScheduled,
            playing,
        } = this.state

        if (playing && !this.attached) {
            hls.attachMedia(this.playerDom.current)
            this.playerDom.current.play()

            this.attached = true
        }

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

        return (
            <div>
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
                                    disabled={is.empty(devices) || !is.empty(anotherExamRunning)}
                                >
                                    {buttonLabel}
                                </Button>
                            </Toolbar>
                        </AppBar>

                        <Grid container className={classes.grid} justify="center">
                            <Grid item lg={5} md={10} sm={12}>
                                {anotherExamRunning && (
                                    <Paper className={classes.paperWarning}>
                                        <Typography color="error">
                                            Está sendo transmitido um exame, você deve primeiro finalizá-lo.

                                            <Button
                                                component={Link}
                                                to={`/transmission/${anotherExamRunning}`}
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
                                    <Typography variant="body1" paragraph={true}>{patientEmails.join(', ')}</Typography>

                                    <Typography variant="body2">Telefone</Typography>
                                    <Typography variant="body1" paragraph={true}>{patientPhones.join(', ')}</Typography>
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
    classes: PropTypes.object.isRequired,
    patientEmails: PropTypes.arrayOf(PropTypes.string),
    patientName: PropTypes.string,
    patientPhones: PropTypes.arrayOf(PropTypes.string),
}

Transmission.defaultProps = {
    patientEmails: [],
    patientName: 'Paciente',
    patientPhones: [],
}

export default withStyles(styles)(Transmission)

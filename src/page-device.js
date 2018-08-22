import React from 'react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import red from '@material-ui/core/colors/red'
import { withStyles } from '@material-ui/core/styles'

import is from 'is_js'

import {
    events as appEvents,
    API_ERROR,
} from './events.js'

import {
    getDevices,
    setDevice,
} from './lib/api/device.js'

const styles = theme => ({
    button: {
        marginTop: theme.spacing.unit * 3,
    },
    buttonProgress: {
        color: red[500],
        left: '50%',
        marginLeft: -12,
        marginTop: -12,
        position: 'absolute',
        top: '50%',
    },
    icon: {
        fontSize: 28,
        marginRight: 5,
    },
    paper: {
        padding: theme.spacing.unit * 4,
        position: 'relative',
        textAlign: 'center',
    },
    root: {
        marginTop: theme.spacing.unit * 4,
    },
    wrapper: {
        marginBottom: theme.spacing.unit * 4,
        marginTop: theme.spacing.unit * 4,
    },
})

class Device extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            busy: props.busy,
            devices: props.devices,
            error: props.error,
            selectedIP: props.selectedIP,
        }

        getDevices().then(data => this.setState({ devices: data }))

        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.handleIPChange = this.handleIPChange.bind(this)
    }

    handleIPChange(e) {
        e.stopPropagation()

        this.setState({ selectedIP: e.target.value })
    }

    handleButtonClick(e) {
        e.stopPropagation()

        const { selectedIP } = this.state
        const { route } = this.props

        this.setState({ busy: true })

        setDevice(selectedIP)
            .then(({ status }) => {
                switch(status) {
                    case 200:
                        route.history.push('/dashboard')
                        break
                    default:
                        appEvents.emit(API_ERROR, {
                            method: 'setDevice',
                            params: [{ selectedIP: selectedIP }],
                            status: status,
                        })
                }
            })
            .then(() => this.setState({ busy: false }))
    }

    render() {
        const { classes } = this.props

        const {
            busy,
            error,
            devices,
            selectedIP,
        } = this.state

        const hasError = !is.empty(error)

        const items = devices.map(x => <MenuItem key={`id_${x.address}`} value={x.address}>{x.address}</MenuItem>)

        const domId = 'ip'

        // o campo select além de ficar desativado quando o formulário está ocupado, também
        // fica desativado quando só contem 1 único item na lista de dispositivos
        const disabledSelect = items.length === 1 || busy

        return (
            <Grid container justify="center" className={classes.root}>
                <Grid item>
                    <Paper className={classes.paper}>
                        <Typography variant="headline" gutterBottom={true}>Dispositivo de captura de vídeo</Typography>

                        {!is.empty(items) && (
                            <React.Fragment>
                                <FormControl fullWidth={true} error={hasError} disabled={busy}>
                                    <InputLabel htmlFor={domId}>IP</InputLabel>

                                    <Select
                                        value={selectedIP}
                                        onChange={this.handleIPChange}
                                        inputProps={{ id: domId }}
                                        disabled={disabledSelect}
                                    >
                                        {items}
                                    </Select>

                                    <FormHelperText>{error}</FormHelperText>
                                </FormControl>

                                <Button
                                    className={classes.button}
                                    color="secondary"
                                    variant="contained"
                                    disabled={busy}
                                    onClick={this.handleButtonClick}
                                >
                                    Salvar
                                </Button>
                            </React.Fragment>
                        )}

                        {is.empty(items) && (
                            <React.Fragment>
                                <Typography color="error">Disposivo não encontrado</Typography>

                                <Button variant="contained" color="secondary" className={classes.button} disabled={busy}>Tentar novamente</Button>
                            </React.Fragment>
                        )}

                        {busy && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

Device.propTypes = {
    busy: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    devices: PropTypes.arrayOf(PropTypes.shape({
        string: PropTypes.string.isRequired,
    })),
    error: PropTypes.string,
    selectedIP: PropTypes.string,
}

Device.defaultProps = {
    busy: false,
    devices: [],
    error: '',
    selectedIP: '',
}

export default withStyles(styles)(Device)

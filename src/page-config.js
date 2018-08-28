import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import { getTokenStatus } from './lib/api/token.js'
import { getDeviceStatus } from './lib/api/device.js'

import Menu from './component-menu.js'

import {
    events as appEvents,
    API_ERROR,
} from './events.js'

const styles = theme => ({
    appBarSpacer: theme.mixins.toolbar,
    flex: {
        flexGrow: 1,
    },
    grid: {
        padding: theme.spacing.unit * 3,
    },
    main: {
        flexGrow: 1,
        height: '100vh',
        padding: theme.spacing.unit * 3,
    },
    paper: {
        margin: 'auto',
        padding: theme.spacing.unit * 2,
        width: 600,
    },
    root: {
        display: 'flex',
    },
})

class Config extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            device: '',
            token: '',
        }

        getTokenStatus().then(response => this.setToken(response))
        getDeviceStatus().then(response => this.setDevice(response))
    }

    setToken(response) {
        switch(response.status) {
            case 200:
                response.json().then(json => this.setState({ token: json.token }))
                break

            case 401:
                this.setState({ token: 'Token cadastrado é inválido!' })
                break

            case 404:
                this.setState({ token: 'Token não cadastrado!' })
                break

            default:
                appEvents.emit(API_ERROR, {
                    method: 'getTokenStatus',
                    params: [],
                    status: response.status,
                })
        }
    }

    setDevice(response) {
        switch(response.status) {
            case 200:
                response.json().then(json => this.setState({ device: json.address }))
                break

            case 404:
                this.setState({ device: 'Dispositivo não encontrado!' })
                break

            default:
                appEvents.emit(API_ERROR, {
                    method: 'getDeviceStatus',
                    params: [],
                    status: response.status,
                })
        }

        return response
    }

    render() {
        const { classes } = this.props
        const {
            device,
            token,
        } = this.state

        return (
            <React.Fragment>
                <div className={classes.root}>
                    <Menu />

                    <AppBar position="absolute" color="default">
                        <Toolbar>
                            <Typography variant="title" color="inherit" className={classes.flex}>
                                Configurações
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <main className={classes.main}>
                        <div className={classes.appBarSpacer} />

                        <Paper className={classes.paper}>
                            <Grid container justify="space-between">
                                <Grid item xs={4} className={classes.formRow}>
                                    <div className={classes.fieldsInfo}>
                                        <Typography color="textPrimary" variant="body1">
                                            Token de acesso
                                        </Typography>

                                        <Typography color="textSecondary" variant="caption">
                                            Chave de acesso para o uso do Vlab Exames
                                        </Typography>
                                    </div>
                                </Grid>

                                <Grid item xs={7} className={classes.formRow}>
                                    <Input fullWidth readOnly={true} value={token} disableUnderline />
                                </Grid>
                            </Grid>

                            <br />

                            <Grid container justify="space-between">
                                <Grid item xs={4} className={classes.formRow}>
                                    <div className={classes.fieldsInfo}>
                                        <Typography color="textPrimary" variant="body1">
                                            Dispositivo
                                        </Typography>

                                        <Typography color="textSecondary" variant="caption">
                                            Endereço do dispositivo de captura de vídeo
                                        </Typography>
                                    </div>
                                </Grid>

                                <Grid item xs={7} className={classes.formRow}>
                                    <Input fullWidth readOnly={true} value={device} disableUnderline />
                                </Grid>
                            </Grid>
                        </Paper>
                    </main>
                </div>
            </React.Fragment>
        )
    }
}

Config.propTypes = {
    classes: PropTypes.object.isRequired,
    clientNameError: PropTypes.string,
}

Config.defaultProps = {
    clientNameError: '',
}

export default withStyles(styles)(Config)

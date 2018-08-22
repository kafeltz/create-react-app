import React from 'react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import red from '@material-ui/core/colors/red'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import is from 'is_js'

import {
    events as appEvents,
    API_ERROR,
} from './events.js'

import { setToken } from './lib/api/token.js'
import { getDeviceStatus } from './lib/api/device.js'

const styles = theme => ({
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
        textAlign: 'center',
    },
    root: {
        marginTop: theme.spacing.unit * 4,
    },
    title: {
        marginBottom: 10,
    },
    wrapper: {
        marginBottom: theme.spacing.unit * 4,
        marginTop: theme.spacing.unit * 4,
    },
})

class Token extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            busy: props.busy,
            error: props.error,
            token: props.token,
        }

        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.handleOnTokenChange = this.handleOnTokenChange.bind(this)
    }

    handleOnTokenChange(e) {
        this.setState({ token: e.currentTarget.value })
    }

    handleButtonClick(e) {
        const { token } = this.state
        const { route } = this.props

        this.setState({ busy: false })

        setToken(token)
            .then(response => {
                switch(response.status) {
                    case 200:
                        getDeviceStatus()
                            .then(({ status })  => {
                                switch(status) {
                                    case 200:
                                        route.history.push('/dashboard')
                                    break

                                    case 404:
                                        route.history.push('/device')
                                    break

                                    default:
                                        appEvents.emit(API_ERROR, {
                                            method: 'getDeviceStatus',
                                            params: [],
                                            status: status,
                                        })
                                }
                            })
                        break
                    case 401:
                        this.setState({ error: 'Token inválido!' })
                        break
                    default:
                        appEvents.emit(API_ERROR, {
                            method: 'setToken',
                            params: [{ token: token }],
                            status: response.status,
                        })
                }
            })
    }

    render() {
        const { classes } = this.props
        const {
            error,
            token,
            busy,
        } = this.state

        const hasError = error.length > 0
        const helper = hasError ? error : 'Informe a chave de acesso para o uso do Vlab Exames'
        const buttonDisabled = busy || is.empty(token.trim())

        return (
            <Grid container justify="center" className={classes.root}>
                <Grid item>
                    <Paper className={classes.paper}>
                        <Typography className={classes.title} variant="headline" component="h3">
                            Bem-vindo ao Vlab Exames
                        </Typography>

                        <FormControl error={hasError} disabled={busy}>
                            <InputLabel disabled={busy}>Token de Acesso</InputLabel>
                            <Input value={token} onChange={this.handleOnTokenChange} disabled={busy} />
                            <FormHelperText disabled={busy}>{helper}</FormHelperText>

                            <div className={classes.wrapper}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    disabled={buttonDisabled}
                                    onClick={this.handleButtonClick}
                                >
                                    Entrar
                                </Button>
                                {busy && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </div>

                            <Typography variant="caption">
                                Saiba como encontrar o seu token de acesso
                            </Typography>
                        </FormControl>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

Token.propTypes = {
    classes: PropTypes.object.isRequired,
    error: PropTypes.string,
    token: PropTypes.string,
    busy: PropTypes.bool,
}

Token.defaultProps = {
    error: '',
    token: '',
    busy: false,
}

export default withStyles(styles)(Token)

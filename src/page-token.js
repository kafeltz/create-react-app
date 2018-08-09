import React from 'react'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'
import red from '@material-ui/core/colors/red'
import SvgIcon from '@material-ui/core/SvgIcon'
import ContactSupportIcon from '@material-ui/icons/ContactSupport'

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        marginBottom: 10,
    },
    paper: {
        padding: theme.spacing.unit * 4,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
        marginTop: 20,
    },
    buttonProgress: {
        color: red[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    icon: {
        fontSize: 28,
        marginRight: 5,
    },
    contactSupport: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        marginTop: '20px',
    }
})

class Token extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            error: props.error,
            token: props.token,
            busy: props.busy,
        }

        this.handleOnTokenChange = this.handleOnTokenChange.bind(this)
    }

    handleOnTokenChange(e) {
        this.setState({ token: e.currentTarget.value })
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

        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <Paper className={classes.paper} elevation={1}>
                            <Typography className={classes.title} variant="headline" component="h3">
                                Bem-vindo ao Vlab Exames
                            </Typography>

                            <FormControl error={hasError} disabled={busy}>
                                <InputLabel htmlFor="name-error" disabled={busy}>Token de Acesso</InputLabel>
                                <Input id="name-error" value={token} onChange={this.handleOnTokenChange} disabled={busy} />
                                <FormHelperText id="name-error-text" disabled={busy}>{helper}</FormHelperText>

                                <div className={classes.wrapper}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={busy}
                                        onClick={this.handleButtonClick}
                                    >
                                        Entrar
                                    </Button>
                                    {busy && <CircularProgress size={24} className={classes.buttonProgress} />}
                                </div>

                                <div className={classes.contactSupport}>
                                    <SvgIcon className={classes.icon}>
                                        <ContactSupportIcon />
                                    </SvgIcon>

                                    <Typography>
                                        Saiba como encontrar o seu token de acesso
                                    </Typography>
                                </div>
                            </FormControl>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
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

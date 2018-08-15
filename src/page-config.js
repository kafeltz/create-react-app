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
import Toolbar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'
import classNames from 'classnames'

import Menu from './component-menu.js'

const styles = theme => ({
    appbar: {
        background: 'white',
        boxShadow: 'unset',
        borderBottom: '1px solid #e0e0e0',
    },
    button: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
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
    pageBusy: {
        opacity: 0.3,
        pointerEvents: 'none',
    },
})

class Config extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            clientNameError: props.clientNameError,
            busy: props.busy,
        }
    }

    render() {
        const { classes } = this.props
        const {
            clientNameError,
            busy
        } = this.state

        return (
            <div>
                <Grid container>
                    <Grid item xs={2}>
                        <Menu />
                    </Grid>

                    <Grid item xs={10}>
                        <AppBar position="static" className={classes.appbar}>
                            <Toolbar>
                                <Typography variant="title" color="inherit" className={classes.flex}>
                                    Configurações
                                </Typography>

                                <Button variant="contained" color="secondary" className={classes.button} onClick={this.handleSaveAndGo}>
                                    Salvar
                                </Button>
                            </Toolbar>
                        </AppBar>

                        <Grid container className={classes.grid} justify="center">
                            <Grid item lg={6} md={12} sm={12}>
                                <form className={classes.form} noValidate autoComplete="off">
                                    <Paper className={classes.paper}>
                                        <Grid container xs={12} justify="space-between" className={classNames({[classes.pageBusy]: busy })}>
                                            <Grid item xs={4} className={classes.formRow}>
                                                <div className={classes.fieldsInfo}>
                                                    <Typography color="textPrimary" variant="body1">
                                                        Token de acesso
                                                    </Typography>

                                                    <Typography color="textSecondary"  variant="caption">
                                                        Informe a sua chave de acesso para o uso do Vlab Exames
                                                    </Typography>
                                                </div>
                                            </Grid>

                                            <Grid item xs={7} className={classes.formRow}>
                                                <FormControl fullWidth error={clientNameError.length !== 0}>
                                                    <Input fullWidth  onChange={this.handleClientChanged} />
                                                    <FormHelperText error={clientNameError.length !== 0}>{clientNameError}</FormHelperText>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </form>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

Config.propTypes = {
    classes: PropTypes.object.isRequired,
    busy: PropTypes.bool,
    clientNameError: PropTypes.string,
}

Config.defaultProps = {
    busy: false,
    clientNameError: '',
}

export default withStyles(styles)(Config)

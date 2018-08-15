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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageBusy: {
        opacity: 0.3,
        pointerEvents: 'none',
    },
    player: {
        width: 400,
        height: 300,
        background: '#000',
    },
})

class Transmission extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    render() {
        const {
            classes,
            name,
        } = this.props

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
                                    <Typography variant="subheading" color="textPrimary">
                                        Paciente
                                    </Typography>

                                    <Typography variant="headline" color="textSecondary">
                                        {name}
                                    </Typography>
                                </div>
                                <Button variant="contained" color="secondary" className={classes.button} onClick={this.handleSaveAndGo}>
                                    Iniciar transmissão
                                </Button>
                            </Toolbar>
                        </AppBar>

                        <Grid container className={classes.grid} justify="center">
                            <Grid item lg={6} md={12} sm={12} >
                                <Paper className={classes.paper}>
                                    <div id="player" className={classes.player}></div>
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
    name: PropTypes.string,
}

Transmission.defaultProps = {
    name: 'Paciente',
}

export default withStyles(styles)(Transmission)

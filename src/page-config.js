import React from 'react'
import classNames from 'classnames'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import { getTokenStatus } from './lib/api/token.js'


import Menu from './component-menu.js'

const styles = theme => ({
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
})

class Config extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            token: '',
        }

        getTokenStatus().then(response => response.json()).then(json => this.setState({ token: json.token }))
    }

    render() {
        const { classes } = this.props
        const {
            token,
        } = this.state

        return (
            <div>
                <Grid container>
                    <Grid item xs={2}>
                        <Menu />
                    </Grid>

                    <Grid item xs={10}>
                        <AppBar position="static" color="default">
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
                                <Paper className={classes.paper}>
                                    <Grid container justify="space-between">
                                        <Grid item xs={4} className={classes.formRow}>
                                            <div className={classes.fieldsInfo}>
                                                <Typography color="textPrimary" variant="body1">
                                                    Token de acesso
                                                </Typography>

                                                <Typography color="textSecondary" variant="caption">
                                                    Informe a sua chave de acesso para o uso do Vlab Exames
                                                </Typography>
                                            </div>
                                        </Grid>

                                        <Grid item xs={7} className={classes.formRow}>
                                            <Input fullWidth readOnly={true} value={token} />
                                        </Grid>
                                    </Grid>
                                </Paper>
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
    clientNameError: PropTypes.string,
}

Config.defaultProps = {
    clientNameError: '',
}

export default withStyles(styles)(Config)

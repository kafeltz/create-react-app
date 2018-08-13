import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import { Link } from 'react-router-dom'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'

import IconButton from '@material-ui/core/IconButton'
import ShareIcon from '@material-ui/icons/Share'
import DeleteIcon from '@material-ui/icons/Delete'
import VideocamIcon from '@material-ui/icons/Videocam'

import emptyImage from './doctor.svg'

import Menu from './component-menu.js'

const PAGE_NO_EXAMS = 'PAGE_NO_EXAMS'
const PAGE_EXAMS = 'PAGE_EXAMS'

const styles = theme => ({
    appbar: {
        background: 'white',
        boxShadow: 'unset',
        borderBottom: '1px solid #e0e0e0',
    },
    flex: {
        flexGrow: 1,
    },
    button: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    paper: {
        padding: theme.spacing.unit * 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    grid: {
        padding: theme.spacing.unit * 3,
    },
    emptyImage: {
        width: '50%',
        height: 'auto',
    },
    text: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
    },
    icon: {
        marginRight: 5,
        marginLeft: 5,
        color: '#757575',
        cursor: 'pointer',
    },
})

class Dashboard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { classes } = this.props

        const newButton = (
            <Button variant="contained" color="secondary" className={classes.button} component={Link} to="/new-exam">
                Agendar exame
            </Button>
        )

        const noExamPage = (
            <React.Fragment>
                <img className={classes.emptyImage} src={emptyImage} alt="" />

                <Typography color="textPrimary" variant="title" className={classes.text}>
                    Não há exames agendados
                </Typography>

                {newButton}
            </React.Fragment>
        )

        const examPage = () => {
            const rows = () => {
                return (
                    <TableRow>
                        <TableCell>
                            lorem
                        </TableCell>

                        <TableCell>
                            lorem
                        </TableCell>

                        <TableCell>
                            <IconButton className={classes.icon}>
                                <ShareIcon />
                            </IconButton>

                            <IconButton className={classes.icon}>
                                <DeleteIcon />
                            </IconButton>

                            <IconButton className={classes.icon}>
                                <VideocamIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                )
            }

            const count = 20
            const rowsPerPage = 10
            const page = 1

            return (
                <React.Fragment>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1">
                                        Data e hora
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    Paciente
                                </TableCell>

                                <TableCell>
                                    &nbsp;
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows()}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': 'Anterior',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Próximo',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </React.Fragment>
            )
        }

        const renderPage = page => {
            if (page === PAGE_EXAMS) {
                return examPage()
            } else if (page === PAGE_NO_EXAMS) {
                return noExamPage
            } else {
                throw new Error('Era esperado alguma página!')
            }
        }

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
                                    Novo exame
                                </Typography>

                                <Button variant="outlined" color="secondary" className={classes.button} onClick={this.handleSave}>
                                    Fitrar
                                </Button>

                                {newButton}
                            </Toolbar>
                        </AppBar>

                        <Grid container className={classes.grid} justify="center">
                            <Grid item xs={12} className={classes.relative}>
                                <Paper className={classes.paper}>
                                    {renderPage(PAGE_EXAMS)}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Dashboard)

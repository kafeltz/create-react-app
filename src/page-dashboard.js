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

import Modal from '@material-ui/core/Modal'

import emptyImage from './assets/doctor.svg'

import Menu from './component-menu.js'

import { getExams } from './lib/api.js'
import { toDate } from './lib/date.js'

const PAGE_NO_EXAMS = 'PAGE_NO_EXAMS'
const PAGE_EXAMS = 'PAGE_EXAMS'

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
    emptyImage: {
        height: 'auto',
        width: '50%',
    },
    flex: {
        flexGrow: 1,
    },
    grid: {
        padding: theme.spacing.unit * 3,
    },
    icon: {
        color: '#757575',
        cursor: 'pointer',
        marginLeft: 5,
        marginRight: 5,
    },
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        position: 'absolute',
        width: theme.spacing.unit * 50,
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    text: {
        marginBottom: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 3,
    },
})

class Dashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            page: 0,
            rowsPerPage: 10,
        }

        const exams = getExams()

        exams.then(data => this.setState({ data: data }))
    }

    handleChangePage(e, page) {
        this.setState({ page })
    }

    render() {
        const { classes } = this.props

        const {
            data,
            rowsPerPage,
            page,
        } = this.state

        const newButton = (
            <Button variant="contained" color="secondary" className={classes.button} component={Link} to="/new-exam">
                Agendar exame
            </Button>
        )

        const noExamPage = (
            <div className={classes.modalPaper}>
                <img className={classes.emptyImage} src={emptyImage} alt="" />

                <Typography color="textPrimary" variant="title" className={classes.text}>
                    Não há exames agendados
                </Typography>

                {newButton}
            </div>
        )

        const examPage = () => {
            const rows = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(x => {
                return (
                    <TableRow key={x.id}>
                        <TableCell>
                            <Typography variant="body1">
                                {toDate(x.scheduled)}
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography variant="body1">
                                {x.patient}
                            </Typography>
                        </TableCell>

                        <TableCell numeric={true}>
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
            })

            const count = data.length

            return (
                <React.Fragment>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="title">
                                        Data e hora
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography variant="title">
                                        Paciente
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    &nbsp;
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows}
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

                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={true}
                    onClose={this.handleClose}
                >
                    <React.Fragment>
                        <Typography variant="title" id="modal-title">
                        Text in a modal
                        </Typography>

                        <Typography variant="subheading" id="simple-modal-description">
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography>
                    </React.Fragment>
                </Modal>
            </div>
        )
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Dashboard)

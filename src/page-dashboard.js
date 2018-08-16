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

import is from 'is_js'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

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

import emptyImage from './assets/doctor.svg'

import Menu from './component-menu.js'

import { getExams } from './lib/api.js'
import { toDate } from './lib/date.js'

const FILTER_ALL = 'FILTER_ALL'
const FILTER_RECORDED = 'FILTER_RECORDED'

const PAGE_NO_EXAMS = 'PAGE_NO_EXAMS'
const PAGE_EXAMS = 'PAGE_EXAMS'
const PAGE_RECORDED_EXAMS = 'PAGE_RECORDED_EXAMS'

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
    modalButtons: {
        marginTop: theme.spacing.unit * 2,
        textAlign: 'right',
        width: '100%',
    },
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        bottom: 0,
        boxShadow: theme.shadows[5],
        height: theme.spacing.unit * 20,
        left: 0,
        margin: 'auto',
        padding: theme.spacing.unit * 2,
        position: 'absolute',
        right: 0,
        top: 0,
        width: theme.spacing.unit * 50,
    },
    noExamPage: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: theme.spacing.unit * 3,
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

        this.route = props.route

        this.state = {
            chosenId: '', // qual id do exame que foi selecionado na hora de clicar em algum botão de ação que abrirá o dialog (como o excluir)
            currentPage: PAGE_EXAMS,
            data: [],
            dialogConfirmDeleteOpen: false,
            page: 0,
            rowsPerPage: 10,
        }

        const exams = getExams()

        exams.then(data => {
            this.setState({ data: data })

            if (is.empty(data)) {
                this.setState({ currentPage: PAGE_NO_EXAMS })
            } else if (this.route.location.search.includes('filter=done')) {
                this.setState({ currentPage: PAGE_RECORDED_EXAMS })
            } else {
                this.setState({ currentPage: PAGE_EXAMS })
            }
        })

        this.handleChangePage = this.handleChangePage.bind(this)
        this.handleCloseConfirmDelete = this.handleCloseConfirmDelete.bind(this)
        this.handleOpenConfirmDelete = this.handleOpenConfirmDelete.bind(this)
    }

    handleChangePage(e, page) {
        e.stopPropagation()

        this.setState({ page })
    }

    handleCloseConfirmDelete(e) {
        e.stopPropagation()

        this.setState({
            chosenId: '',
            dialogConfirmDeleteOpen: false,
        })
    }

    handleOpenConfirmDelete(e, id) {
        e.stopPropagation()

        this.setState({
            chosenId: id,
            dialogConfirmDeleteOpen: true,
        })
    }

    render() {
        const { classes } = this.props

        const {
            currentPage,
            data,
            dialogConfirmDeleteOpen,
            page,
            rowsPerPage,
        } = this.state

        const newButton = (
            <Button variant="contained" color="secondary" className={classes.button} component={Link} to="/new-exam">
                Agendar exame
            </Button>
        )

        const noExamPage = (
            <div className={classes.noExamPage}>
                <img className={classes.emptyImage} src={emptyImage} alt="" />

                <Typography color="textPrimary" variant="title" className={classes.text}>
                    Não há exames agendados
                </Typography>

                {newButton}
            </div>
        )

        const examPage = ({ filter }) => {
            let rows = []
            rows = data.filter(x => {
                if (filter === FILTER_RECORDED) {
                    return x.recorded
                } else {
                    return !x.recorded
                }
            })

            rows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(x => {
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

                            <IconButton className={classes.icon} onClick={e => this.handleOpenConfirmDelete(e, x.id)}>
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
                                    Data e hora
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
                            {rows}
                        </TableBody>
                    </Table>

                    <TablePagination
                        labelRowsPerPage="Linhas por página"
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

        const renderPage = () => {
            if (currentPage === PAGE_EXAMS) {
                return examPage({ filter: FILTER_ALL })
            } else if (currentPage === PAGE_RECORDED_EXAMS) {
                return examPage({ filter: FILTER_RECORDED })
            } else if (currentPage === PAGE_NO_EXAMS) {
                return noExamPage
            } else {
                throw new Error('Era esperado alguma página!')
            }
        }

        const pageTitle = () => {
            if (currentPage === PAGE_RECORDED_EXAMS) {
                return 'Exames gravados'
            } else {
                return 'Exames agendados'
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
                                    {pageTitle()}
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
                                    {renderPage()}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Dialog
                    open={dialogConfirmDeleteOpen}
                    onClose={this.handleCloseConfirmDelete}
                >
                    <DialogTitle>Deseja apagar este exame?</DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            Esta ação não poderá ser desfeita.
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleCloseConfirmDelete} color="primary">
                            Cancelar
                        </Button>

                        <Button onClick={this.handleCloseConfirmDelete} color="primary">
                            Apagar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Dashboard)

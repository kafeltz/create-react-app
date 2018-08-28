import React from 'react'
import { Link } from 'react-router-dom'
import is from 'is_js'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

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

import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import ShareIcon from '@material-ui/icons/Share'
import VideocamIcon from '@material-ui/icons/Videocam'

import emptyImage from './assets/doctor.svg'

import Menu from './component-menu.js'

import {
    API_ERROR,
    API_EXCEPTION,
    events as appEvents,
} from './events.js'

import {
    disableExam,
    getExams,
    notifyExam,
} from './lib/api/exam.js'

import { toDate } from './lib/date.js'

const FILTER_ALL = 'FILTER_ALL'
const FILTER_RECORDED = 'FILTER_RECORDED'

const PAGE_NO_EXAMS = 'PAGE_NO_EXAMS'
const PAGE_EXAMS = 'PAGE_EXAMS'
const PAGE_RECORDED_EXAMS = 'PAGE_RECORDED_EXAMS'

const styles = theme => ({
    appBarSpacer: theme.mixins.toolbar,
    appbarSearch: {
        background: theme.palette.grey[100],
        borderRadius: '2px',
        marginRight: theme.spacing.unit,
        padding: '2px',
        paddingLeft: '8px',
        paddingRight: '8px',
    },
    button: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    emptyImage: {
        height: 'auto',
        width: '230px',
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
    main: {
        flexGrow: 1,
        height: '100vh',
        padding: theme.spacing.unit * 3,
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
        margin: 'auto',
        padding: theme.spacing.unit * 2,
    },
    searchIcon: {
        color: '#757575',
    },
    searchIconEndAdornsement: {
        color: '#757575',
        cursor: 'pointer',
    },
    text: {
        marginBottom: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 3,
    },
    root: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
})

class Dashboard extends React.Component {
    constructor(props) {
        super(props)

        this.route = props.route

        this.state = {
            chosenId: '', // qual id do exame que foi selecionado na hora de clicar em algum botão de ação que abrirá o dialog (como o excluir)
            data: [], // lista de exames
            dialogConfirmDeleteOpen: false,
            dialogConfirmResendOpen: false,
            fetched: false,
            filter: false, // indica se é pra filtrar ou não os dados conforme a string no input (normalmente quando apertar a tecla enter)
            page: 0,
            rowsPerPage: 10,
            search: '', // string que será usada pra filtrar os dados
        }

        getExams()
            .then(data => this.setState({ data: data, fetched: true }))
            .catch(e => appEvents.emit(API_EXCEPTION, e))

        appEvents.emit('CAN_RENDER_FLOAT_PLAYER', true)

        this.handleChangePage = this.handleChangePage.bind(this)
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
        this.handleCloseConfirmDelete = this.handleCloseConfirmDelete.bind(this)
        this.handleCloseConfirmResend = this.handleCloseConfirmResend.bind(this)
        this.handleOpenConfirmDelete = this.handleOpenConfirmDelete.bind(this)
        this.handleOpenConfirmResend = this.handleOpenConfirmResend.bind(this)
        this.handleSearchClear = this.handleSearchClear.bind(this)
        this.handleSearchOnChange = this.handleSearchOnChange.bind(this)
        this.handleTransmission = this.handleTransmission.bind(this)
    }

    handleChangePage(e, page) {
        e.stopPropagation()

        this.setState({ page: page })
    }

    handleChangeRowsPerPage(e) {
        this.setState({ rowsPerPage: e.target.value })
    }

    removeExam(id) {
        const { data } = this.state

        const newData = data.filter(x => x.id !== id)

        this.setState({ data: newData })
    }

    handleCloseConfirmDelete(e, resendAndClose) {
        const { chosenId } = this.state

        e.stopPropagation()

        if (resendAndClose) {
            disableExam(chosenId)
                .then(response => {
                    if (response.status === 200) {
                        this.removeExam(chosenId)
                    }
                })
                .catch(e => appEvents.emit(API_EXCEPTION, e))
        }

        this.setState({
            chosenId: '',
            dialogConfirmDeleteOpen: false,
        })
    }

    handleCloseConfirmResend(e, deleteAndClose) {
        const { chosenId } = this.state

        e.stopPropagation()

        if (deleteAndClose) {
            notifyExam(chosenId)
                .then(response => {
                    switch(response.status) {
                        case 200:
                        case 202:
                            break

                        case 400:
                        case 404:
                        default:
                            appEvents.emit(API_ERROR, {
                                method: 'disableExam',
                                params: [{ chosenId: chosenId }],
                                status: response.status,
                            })
                            break
                    }
                })
                .catch(e => appEvents.emit(API_EXCEPTION, e))
        }

        this.setState({
            chosenId: '',
            dialogConfirmResendOpen: false,
        })
    }

    handleOpenConfirmDelete(e, id) {
        e.stopPropagation()

        this.setState({
            chosenId: id,
            dialogConfirmDeleteOpen: true,
        })
    }

    handleOpenConfirmResend(e, id) {
        e.stopPropagation()

        this.setState({
            chosenId: id,
            dialogConfirmResendOpen: true,
        })
    }

    handleTransmission(e, id) {
        e.stopPropagation()

        this.route.history.push(`/transmission/${id}`)
    }

    handleSearchClear(e) {
        e.stopPropagation()

        this.setState({ search: '' })
    }

    handleSearchOnChange(e) {
        const value = e.currentTarget.value.trim().toLowerCase()

        e.stopPropagation()

        this.setState({ search: value })
    }

    currentPage() {
        const {
            data,
            fetched,
        } = this.state

        if (is.empty(data) && fetched) {
            return PAGE_NO_EXAMS
        } else if (this.props.route.location.search.includes('filter=done')) {
            return PAGE_RECORDED_EXAMS
        } else {
            return PAGE_EXAMS
        }
    }

    render() {
        const { classes } = this.props

        const {
            data,
            dialogConfirmDeleteOpen,
            dialogConfirmResendOpen,
            page,
            rowsPerPage,
            search,
        } = this.state

        const newButton = (
            <Button variant="contained" color="secondary" className={classes.button} component={Link} to="/new-exam">
                Agendar exame
            </Button>
        )

        const noExamPage = () => {
            const title = this.currentPage() === PAGE_EXAMS ? 'Não há exames agendados' : 'Não há exames gravados'

            return (
                <div className={classes.noExamPage}>
                    <img className={classes.emptyImage} src={emptyImage} alt="" />

                    <Typography color="textPrimary" variant="title" className={classes.text}>
                        {title}
                    </Typography>

                    {newButton}
                </div>
            )
        }

        const examPage = (filterRecorded) => {
            let rows = []
            rows = data.filter(x => {
                if (filterRecorded === FILTER_RECORDED) {
                    return x.recorded
                } else {
                    return !x.recorded
                }
            })

            if (!is.empty(search)) {
                rows = rows.filter(x => x.patient.toLowerCase().includes(search))
            }

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
                            <IconButton className={classes.icon} onClick={e => this.handleOpenConfirmResend(e, x.id)}>
                                <ShareIcon />
                            </IconButton>

                            <IconButton className={classes.icon} onClick={e => this.handleOpenConfirmDelete(e, x.id)}>
                                <DeleteIcon />
                            </IconButton>

                            <IconButton className={classes.icon} onClick={e => this.handleTransmission(e, x.id)}>
                                <VideocamIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                )
            })

            const count = rows.length

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
            const filter = this.props.route.location.search.includes('filter=done') ? FILTER_RECORDED : FILTER_ALL

            if (this.currentPage() === PAGE_NO_EXAMS) {
                return noExamPage()
            } else {
                return examPage(filter)
            }
        }

        const pageTitle = () => {
            if (this.currentPage() === PAGE_RECORDED_EXAMS) {
                return 'Exames gravados'
            } else {
                return 'Exames agendados'
            }
        }

        return (
            <React.Fragment>
                <div className={classes.root}>
                    <Menu />

                    <AppBar position="absolute" color="default">
                        <Toolbar>
                            <Typography variant="title" color="inherit" className={classes.flex}>
                                {pageTitle()}
                            </Typography>

                            <Input
                                className={classes.appbarSearch}
                                onChange={this.handleSearchOnChange}
                                disableUnderline={true}
                                value={search}
                                startAdornment={
                                    <InputAdornment position="start"><SearchIcon className={classes.searchIcon} /></InputAdornment>
                                }

                                endAdornment={
                                    <InputAdornment position="end" onClick={this.handleSearchClear}><CloseIcon className={classes.searchIconEndAdornsement} /></InputAdornment>
                                }
                            />

                            {newButton}
                        </Toolbar>
                    </AppBar>

                    <main className={classes.main}>
                        <div className={classes.appBarSpacer} />

                        <Paper className={classes.paper}>
                            {renderPage()}
                        </Paper>
                    </main>

                    <Dialog
                        open={dialogConfirmDeleteOpen}
                        onClose={e => this.handleCloseConfirmDelete(e, false)}
                    >
                        <DialogTitle>Deseja apagar este exame?</DialogTitle>

                        <DialogContent>
                            <DialogContentText>
                                Esta ação não poderá ser desfeita.
                            </DialogContentText>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={e => this.handleCloseConfirmDelete(e, false)} color="primary">
                                Cancelar
                            </Button>

                            <Button onClick={e => this.handleCloseConfirmDelete(e, true)} color="primary">
                                Apagar
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={dialogConfirmResendOpen}
                        onClose={e => this.handleCloseConfirmResend(e, false)}
                    >
                        <DialogTitle>Reenvio de notificação</DialogTitle>

                        <DialogContent>
                            <DialogContentText>
                                Deseja enviar novamente a notificação via SMS/E-mail?
                            </DialogContentText>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={e => this.handleCloseConfirmResend(e, false)} color="primary">
                                Cancelar
                            </Button>

                            <Button onClick={e => this.handleCloseConfirmResend(e, true)} color="primary">
                                Reenviar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </React.Fragment>
        )
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Dashboard)

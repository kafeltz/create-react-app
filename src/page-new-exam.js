import MaskedInput from 'react-text-mask'
import PropTypes from 'prop-types'
import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import classNames from 'classnames'
import ClearIcon from '@material-ui/icons/Clear'
import FormControl from '@material-ui/core/FormControl'
import CloseIcon from '@material-ui/icons/Close'

import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'

import moment from 'moment'
import Menu from './component-menu.js'

import {
    saveExam,
    NEED_BE_IN_FUTURE,
} from './lib/api.js'

import { toIsoDate } from './lib/date.js'

import is from 'is_js'

import {
    FORM_AT_LEAST_ONE_CONTACT,
    FORM_INVALID_EMAIL,
    FORM_INVALID_PHONE,
    FORM_NOT_NULL,
    REGEX_PHONE,
} from './lib/consts.js'

const styles = theme => {
    return {
        appbar: {
            background: 'white',
            borderBottom: '1px solid #e0e0e0',
            boxShadow: 'unset',
        },
        button: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
        },
        buttonAddMore: {
            color: theme.palette.primary.dark,
            fontWeight: 600,
        },
        dateAndTime: {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: 270,
        },
        email: {
            width: 250,
        },
        emails: {
            alignItems: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
        },
        field: {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.unit * 3,
        },
        flex: {
            flexGrow: 1,
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
        },
        formControl: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            marginTop: theme.spacing.unit * 3,
        },
        formRow: {
            marginBottom: theme.spacing.unit * 3,
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
        inputDate: {
            marginRight: theme.spacing.unit * 1,
            width: 160,
        },
        inputTime: {
            width: 80,
        },
        inputWithAddIcon: {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            width: 300,
        },
        pageBusy: {
            opacity: 0.3,
            pointerEvents: 'none',
        },
        paper: {
            padding: theme.spacing.unit * 3,
            position: 'relative',
        },
        phones: {
            alignItems: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
        },
        progress: {
            bottom: 0,
            left: 0,
            margin: 'auto',
            position: 'absolute',
            right:0,
            top: 0,
            zIndex: 1000,
        },
        progressHidden: {
            display: 'none',
        },
        relative: {
            position: 'relative',
        },
        snackbar: {
            backgroundColor: theme.palette.error.dark,
        },
        telefone: {
            width: 160,
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            marginTop: theme.spacing.unit * 3,
        },
    }
}

const TextMaskCustom = props => {
    const { inputRef, ...other } = props

    return (
        <MaskedInput
            {...other}
            ref={inputRef}
            mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    )
}

TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
}

const aaaammdd = ddmmaaaa => {
    return ddmmaaaa.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')
}

const isValidPhone = phone => phone.match(REGEX_PHONE) !== null

class NewExam extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            busy: props.busy,
            clientName: props.clientName,
            clientNameError: props.clientNameError,
            date: aaaammdd(props.datetime.split(' ')[0]),
            dateAndTimeError: '',
            email: props.email,
            emailError: props.emailError,
            extraEmails: props.extraEmails,
            extraEmailsError: props.extraEmailsError,
            extraPhones: props.extraPhones,
            extraPhonesError: props.extraPhonesError,
            phone: props.phone,
            phoneError: props.phoneError,
            snackbarMessage: '',
            snackbarOpen: false,
            time: props.datetime.split(' ')[1],
        }

        this.route = props.route

        this.handleAddEmail = this.handleAddEmail.bind(this)
        this.handleAddPhone = this.handleAddPhone.bind(this)
        this.handleClientChanged = this.handleClientChanged.bind(this)
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this)
        this.handleDateChanged = this.handleDateChanged.bind(this)
        this.handleEmailChanged = this.handleEmailChanged.bind(this)
        this.handleExtraEmailChanged = this.handleExtraEmailChanged.bind(this)
        this.handleExtraPhoneChanged = this.handleExtraPhoneChanged.bind(this)
        this.handlePhoneChanged = this.handlePhoneChanged.bind(this)
        this.handleRemoveEmail = this.handleRemoveEmail.bind(this)
        this.handleRemovePhone = this.handleRemovePhone.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleSaveAndGo = this.handleSaveAndGo.bind(this)
        this.handleTimeChanged = this.handleTimeChanged.bind(this)
    }

    handleEmailChanged(e) {
        e.stopPropagation()

        const value = e.currentTarget.value

        this.setState({
            email: value,
        })
    }

    handlePhoneChanged(e) {
        e.stopPropagation()

        const value = e.currentTarget.value !== '(  )      -    ' ? e.currentTarget.value : ''

        this.setState({
            phone: value,
        })
    }

    handleAddPhone(e) {
        e.stopPropagation()

        const {
            extraPhones,
            extraPhonesError,
        } = this.state

        this.setState({
            extraPhones: [...extraPhones, ''],
            extraPhonesError: [...extraPhonesError, '']
        })
    }

    handleAddEmail(e) {
        e.stopPropagation()

        const {
            extraEmails,
            extraEmailsError,
        } = this.state

        this.setState({
            extraEmails: [...extraEmails, ''],
            extraEmailsError: [...extraEmailsError, ''],
        })
    }

    handleRemovePhone(e) {
        e.stopPropagation()

        const index = parseInt(e.currentTarget.dataset.index, 10)

        const {
            extraPhones,
            extraPhonesError,
        } = this.state

        const newExtraPhones = extraPhones.filter((number, i) => i !== index)
        const newExtraPhonesError = extraPhonesError.filter((number, i) => i !== index)

        this.setState({
            extraPhones: newExtraPhones,
            extraPhonesError: newExtraPhonesError,
        })
    }

    handleRemoveEmail(e) {
        e.stopPropagation()

        const index = parseInt(e.currentTarget.dataset.index, 10)
        const {
            extraEmails,
            extraEmailsError,
        } = this.state
        const newExtraEmail = extraEmails.filter((number, i) => i !== index)
        const newExtraEmailError = extraEmailsError.filter((number, i) => i !== index)

        this.setState({
            extraEmails: newExtraEmail,
            extraEmailsError: newExtraEmailError,
        })
    }

    handleExtraPhoneChanged(e, index) {
        e.stopPropagation()

        const { extraPhones } = this.state
        const value = e.currentTarget.value !== '(  )      -    ' ? e.currentTarget.value : ''

        extraPhones[index] = value

        this.setState({ extraPhones: extraPhones })
    }

    handleExtraEmailChanged(e, index) {
        e.stopPropagation()

        const { extraEmails } = this.state
        const value = e.currentTarget.value

        extraEmails[index] = value

        this.setState({ extraEmails: extraEmails })
    }

    handleDateChanged(e) {
        e.stopPropagation()

        const value = e.currentTarget.value

        this.setState({
            date: value,
        })
    }

    handleTimeChanged(e) {
        e.stopPropagation()

        const value = e.currentTarget.value

        this.setState({
            time: value,
        })
    }

    handleClientChanged(e) {
        e.stopPropagation()

        const value = e.currentTarget.value

        this.setState({
            clientName: value,
        })
    }

    isValid() {
        const {
            clientName,
            date,
            email,
            extraEmails,
            extraPhones,
            phone,
            time,
            extraPhonesError,
            extraEmailsError,
        } = this.state

        let isValid = true

        if (is.empty(clientName)) {
            this.setState({ clientNameError: FORM_NOT_NULL })
            isValid = false
        } else {
            this.setState({ clientNameError: '' })
        }

        let dateToValidate = `${date} ${time}`

        if (is.empty(dateToValidate)) {
            this.setState({ dateAndTimeError: FORM_NOT_NULL })
            isValid = false
        } else if (!moment(dateToValidate, 'YYYY-MM-DD HH:mm').isValid()) {
            this.setState({ dateAndTimeError: !moment(dateToValidate, 'YYYY-MM-DD HH:mm').isValid() })
            isValid = false
        } else {
            this.setState({ dateAndTimeError: '' })
        }

        if (!is.empty(phone) && !isValidPhone(phone)) {
            this.setState({ FORM_INVALID_PHONE })
            isValid = false
        } else {
            this.setState({ phoneError: '' })
        }

        for (let i = 0, total = extraPhones.length; i < total; i++) {
            // telefones extras não podem ser vazios como o telefone pode
            if (is.empty(extraPhones[i])) {
                extraPhonesError[i] = FORM_NOT_NULL
                isValid = false
            } else if (!isValidPhone(extraPhones[i])) {
                extraPhonesError[i] = FORM_INVALID_PHONE
                isValid = false
            } else {
                extraPhonesError[i] = ''
            }

            this.setState({ extraPhonesError: extraPhonesError })
        }

        if (!is.empty(email) && !is.email(email)) {
            this.setState({ emailError: FORM_INVALID_EMAIL })
            isValid = false
        } else {
            this.setState({ emailError: '' })
        }

        for (let i = 0, total = extraEmails.length; i < total; i++) {
            // emails extras não podem serem vazios como o email pode
            if (is.empty(extraEmails[i])) {
                extraEmailsError[i] = FORM_NOT_NULL
                isValid = false
            } else if (!is.email(extraEmails[i])) {
                extraEmailsError[i] = FORM_INVALID_EMAIL
                isValid = false
            } else {
                extraEmailsError[i] = ''
            }

            this.setState({ extraPhonesError: extraPhonesError })
        }

        // pelo menos um email ou um phone tem que ter no formulário
        // mas só exibir o erro se o formulário tá tudo certo e só falta esse problema pra corrigir
        if (isValid && is.empty(email) && is.empty(phone)) {
            this.setState({
                snackbarMessage: FORM_AT_LEAST_ONE_CONTACT,
                snackbarOpen: true,
            })

            isValid = false
        }

        return isValid
    }

    handleSave(e) {
        const {
            clientName,
            date,
            email,
            extraEmails,
            extraPhones,
            phone,
            time,
        } = this.state

        if (this.isValid()) {
            const payload = {
                datetime: `${date} ${time}`,
                emails: [].concat(email).concat(extraEmails),
                patientName: clientName,
                phones: [].concat(phone).concat(extraPhones),
            }

            this.setState({ busy: true })

            this.handleSaveExamResponse(saveExam(payload))
        }
    }

    handleSaveExamResponse(promise) {
        promise
            .then(response => {
                this.setState({ busy: false })

                return response
            })
            .then(response => {
                if (response.status === 201) {
                    this.route.history.push('/dashboard')
                } else if (response.status === 400) {
                    response.json().then(json => {
                        if (json.error['scheduled'] === NEED_BE_IN_FUTURE) {
                            this.setState({
                                snackbarMessage: 'Você deve informar uma data ou hora futura.',
                                snackbarOpen: true,
                            })
                        }
                    })
                }
            })
            .catch(e => {
                this.setState({ busy: false })
                console.error(e.message)
            })
    }

    handleSaveAndGo(e) {
    }

    handleCloseSnackbar(e, reason) {
        if (reason === 'clickaway') {
            return
        }

        this.setState({ snackbarOpen: false })
    }

    render() {
        const { classes } = this.props

        const {
            busy,
            clientName,
            clientNameError,
            date,
            dateAndTimeError,
            email,
            emailError,
            extraEmails,
            extraEmailsError,
            extraPhones,
            phone,
            phoneError,
            snackbarMessage,
            snackbarOpen,
            time,
        } = this.state

        const phones = extraPhones.map((p, index) => {
            const {
                extraPhones,
                extraPhonesError,
            } = this.state

            const value = extraPhones[index]
            const error = extraPhonesError[index]

            return (
                <div className={classes.inputWithAddIcon} key={`phone_key_${index}`}>
                    <FormControl>
                        <Input className={classes.telefone} inputComponent={TextMaskCustom} value={value} onChange={e => this.handleExtraPhoneChanged(e, index)} />
                        {error && <FormHelperText error={!is.empty(error)}>{error}</FormHelperText>}
                    </FormControl>

                    <IconButton data-index={index} className={classes.icon} onClick={this.handleRemovePhone}>
                        <ClearIcon />
                    </IconButton>
                </div>
            )
        })

        const emails = extraEmails.map((e, index) => {
            const error = extraEmailsError[index]
            const value = extraEmails[index]

            return (
                <div className={classes.inputWithAddIcon} key={`email_key_${index}`}>
                    <FormControl>
                        <Input className={classes.email} placeholder="exemplo@exemplo.com" value={value} onChange={e => this.handleExtraEmailChanged(e, index)} />
                        {error && <FormHelperText error={!is.empty(error)}>{error}</FormHelperText>}
                    </FormControl>

                    <IconButton data-index={index} className={classes.icon} onClick={this.handleRemoveEmail}>
                        <ClearIcon />
                    </IconButton>
                </div>
            )
        })

        return (
            <div>
                <Snackbar
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleCloseSnackbar}
                >
                    <SnackbarContent
                        className={classes.snackbar}
                        message={snackbarMessage}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                onClick={this.handleCloseSnackbar}
                            >
                                <CloseIcon />
                            </IconButton>,
                        ]}
                    />
                </Snackbar>

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

                                <Button variant="outlined" color="secondary" className={classes.button} onClick={this.handleSaveAndGo} disabled={busy}>
                                    Salvar e transmitir
                                </Button>

                                <Button variant="contained" color="secondary" className={classes.button} onClick={this.handleSave} disabled={busy}>
                                    Salvar exame
                                </Button>
                            </Toolbar>
                        </AppBar>

                        <Grid container className={classes.grid} justify="center">
                            <Grid item lg={6} md={12} sm={12} className={classes.relative}>
                                <CircularProgress className={classNames({ [classes.progress]: true, [classes.progressHidden]: !busy })} />

                                <form className={classes.form} noValidate autoComplete="off">
                                    <Paper className={classes.paper}>
                                        <Grid container justify="space-between" className={classNames({[classes.pageBusy]: busy })}>
                                            <Grid item xs={4} className={classes.formRow}>
                                                <div className={classes.fieldsInfo}>
                                                    <Typography color="textPrimary" variant="body1">
                                                        Nome do paciente
                                                    </Typography>

                                                    <Typography color="textSecondary"  variant="caption">
                                                        Nome completo do paciente para identificá-lo no dia do exame
                                                    </Typography>
                                                </div>
                                            </Grid>

                                            <Grid item xs={7} className={classes.formRow}>
                                                <FormControl fullWidth error={clientNameError.length !== 0}>
                                                    <Input fullWidth value={clientName} onChange={this.handleClientChanged} />
                                                    <FormHelperText error={clientNameError.length !== 0}>{clientNameError}</FormHelperText>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={4} className={classes.formRow}>
                                                <div className={classes.fieldsInfo}>
                                                    <Typography color="textPrimary" variant="body1">
                                                        Data e hora
                                                    </Typography>

                                                    <Typography color="textSecondary"  variant="caption">
                                                        Informe o dia e hora da reunião
                                                    </Typography>
                                                </div>
                                            </Grid>

                                            <Grid item xs={7} className={classes.formRow}>
                                                <FormControl fullWidth error={!is.empty(dateAndTimeError)} className={classes.dateAndTime}>
                                                    <Input type="date" className={classes.inputDate} value={date} onChange={this.handleDateChanged} />
                                                    <Input type="time" className={classes.inputTime} value={time} onChange={this.handleTimeChanged} />
                                                    {dateAndTimeError && <FormHelperText error={!is.empty(dateAndTimeError)}>{dateAndTimeError}</FormHelperText>}
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={4} className={classes.formRow}>
                                                <div className={classes.fieldsInfo}>
                                                    <Typography color="textPrimary" variant="body1">
                                                        Telefones
                                                    </Typography>

                                                    <Typography color="textSecondary"  variant="caption">
                                                        Telefones que irão receber o SMS com o link da transmissão
                                                    </Typography>
                                                </div>
                                            </Grid>

                                            <Grid item xs={7} className={classes.formRow}>
                                                <div className={classes.phones}>
                                                    <div className={classes.inputWithAddIcon}>
                                                        <FormControl error={!is.empty(phoneError)}>
                                                            <Input value={phone} className={classes.telefone} inputComponent={TextMaskCustom} onChange={this.handlePhoneChanged} />
                                                            <FormHelperText error={!is.empty(phoneError)}>{phoneError}</FormHelperText>
                                                        </FormControl>
                                                    </div>

                                                    {phones}

                                                    <Button size="small" color="primary" onClick={this.handleAddPhone} className={classes.buttonAddMore}>
                                                        Adicionar telefone
                                                    </Button>
                                                </div>
                                            </Grid>

                                            <Grid item xs={4} className={classes.formRow}>
                                                <div className={classes.fieldsInfo}>
                                                    <Typography color="textPrimary" variant="body1">
                                                        E-mails
                                                    </Typography>

                                                    <Typography color="textSecondary"  variant="caption">
                                                        E-mails que irão receber o link da transmissão
                                                    </Typography>
                                                </div>
                                            </Grid>

                                            <Grid item xs={7} className={classes.formRow}>
                                                <div className={classes.emails}>
                                                    <div className={classes.inputWithAddIcon}>
                                                        <FormControl error={!is.empty(emailError)}>
                                                            <Input value={email} className={classes.email} placeholder="exemplo@exemplo.com" onChange={this.handleEmailChanged} />
                                                            <FormHelperText error={!is.empty(emailError)}>{emailError}</FormHelperText>
                                                        </FormControl>
                                                    </div>

                                                    {emails}

                                                    <Button size="small" color="primary" onClick={this.handleAddEmail} className={classes.buttonAddMore}>
                                                        Adicionar e-mail
                                                    </Button>
                                                </div>
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

NewExam.propTypes = {
    busy: PropTypes.bool,
    clientName: PropTypes.string,
    clientNameError: PropTypes.string,
    datetime: PropTypes.string, // yyyy-MM-dd hh:mm
    email: PropTypes.string,
    emailError: PropTypes.string,
    extraEmails: PropTypes.arrayOf(PropTypes.string),
    extraEmailsError: PropTypes.arrayOf(PropTypes.string),
    extraPhones: PropTypes.arrayOf(PropTypes.string),
    onSave: PropTypes.func,
    phone: PropTypes.string,
    phoneError: PropTypes.string,
}

NewExam.defaultProps = {
    busy: false,
    clientName: '',
    clientNameError: '',
    datetime: moment().format('YYYY-MM-DD HH:mm'),
    email: '',
    emailError: '',
    extraEmails: [],
    extraEmailsError: [],
    extraPhones: [],
    extraPhonesError: '',
    onSave: () => console.info('NewExam:onSave is not bound!'),
    phone: '',
    phoneError: '',
}

export default withStyles(styles)(NewExam)

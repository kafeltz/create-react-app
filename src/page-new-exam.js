import MaskedInput from 'react-text-mask'
import PropTypes from 'prop-types'
import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import classNames from 'classnames'
import ClearIcon from '@material-ui/icons/Clear'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => {
    return {
        appbar: {
            background: 'white',
            boxShadow: 'unset',
            borderBottom: '1px solid #e0e0e0',
        },
        button: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
        },
        buttonAddMore: {
            color: theme.palette.primary.dark,
            fontWeight: 600,
        },
        grid: {
            padding: theme.spacing.unit * 3,
        },
        paper: {
            padding: theme.spacing.unit * 3,
            position: 'relative',
        },
        pageBusy: {
            opacity: 0.3,
            pointerEvents: 'none',
        },
        form: {
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            marginTop: theme.spacing.unit * 3,
        },
        formControl: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            marginTop: theme.spacing.unit * 3,
        },
        field: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.unit * 3,
        },
        dateAndTime: {
            width: 300,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
        },
        inputDate: {
            width: 160,
            marginRight: theme.spacing.unit * 1,
        },
        inputTime: {
            width: 75,
        },
        icon: {
            marginRight: 5,
            marginLeft: 5,
            color: '#757575',
            cursor: 'pointer',
        },
        inputWithAddIcon: {
            width: 300,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
        },
        phones: {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            alignItems: 'flex-start',
        },
        flex: {
            flexGrow: 1,
        },
        telefone: {
            width: 160,
        },
        email: {
            width: 250,
        },
        emails: {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            alignItems: 'flex-start',
        },
        progress: {
            position: 'absolute',
            margin: 'auto',
            left: 0,
            right:0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
        },
        progressHidden: {
            display: 'none',
        },
        relative: {
            position: 'relative',
        },
        formRow: {
            marginBottom: theme.spacing.unit * 3,
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

class NewExam extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            busy: props.busy,
            clientName: props.clientName,
            clientNameError: props.clientNameError,
            date: aaaammdd(props.datetime.split(' ')[0]),
            email: props.email,
            emailError: props.emailError,
            extraEmails: props.extraEmails,
            extraEmailsError: props.extraEmailsError,
            extraPhones: props.extraPhones,
            phone: props.phone,
            phoneError: props.phoneError,
            time: props.datetime.split(' ')[1],
        }

        this.handleAddEmail = this.handleAddEmail.bind(this)
        this.handleAddPhone = this.handleAddPhone.bind(this)
        this.handleClientChanged = this.handleClientChanged.bind(this)
        this.handleDataChanged = this.handleDataChanged.bind(this)
        this.handleExtraPhoneChanged = this.handleExtraPhoneChanged.bind(this)
        this.handlePhoneChanged = this.handlePhoneChanged.bind(this)
        this.handleRemoveEmail = this.handleRemoveEmail.bind(this)
        this.handleRemovePhone = this.handleRemovePhone.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleSaveAndGo = this.handleSaveAndGo.bind(this)
        this.handleTimeChanged = this.handleTimeChanged.bind(this)
    }

    handlePhoneChanged(e) {
        e.stopPropagation()

        const value = e.currentTarget.value

        this.setState({
            phone: value,
        })
    }

    handleAddPhone(e) {
        e.stopPropagation()

        const { extraPhones } = this.state

        const newPhone = [...extraPhones, '']

        this.setState({
            extraPhones: newPhone,
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
        const { extraPhones } = this.state
        const newExtraPhones = extraPhones.filter((number, i) => i !== index)

        this.setState({
            extraPhones: newExtraPhones,
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
        const value = e.currentTarget.value

        extraPhones[index] = value

        this.setState({ extraPhones: extraPhones })
    }

    handleDataChanged(e) {
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

    handleSave(e) {
    }

    handleSaveAndGo(e) {
    }

    render() {
        const { classes } = this.props

        const {
            busy,
            clientName,
            clientNameError,
            date,
            email,
            emailError,
            extraEmails,
            extraEmailsError,
            extraPhones,
            phone,
            phoneError,
            time,
        } = this.state

        const phones = extraPhones.map((p, index) => {
            const { extraPhones } = this.state
            const value = extraPhones[index]

            return (
                <div className={classes.inputWithAddIcon} key={`phone_key_${index}`}>
                    <FormControl>
                        <Input className={classes.telefone} inputComponent={TextMaskCustom} value={value} onChange={e => this.handleExtraPhoneChanged(e, index)} />
                        <FormHelperText ></FormHelperText>
                    </FormControl>

                    <IconButton data-index={index} className={classes.icon} onClick={this.handleRemovePhone}>
                        <ClearIcon />
                    </IconButton>
                </div>
            )
        })

        const emails = extraEmails.map((e, index) => {
            const error = extraEmailsError[index]

            return (
                <div className={classes.inputWithAddIcon} key={`email_key_${index}`}>
                    <FormControl>
                        <Input className={classes.email} placeholder="exemplo@exemplo.com" value={e} />
                        {error && <FormHelperText error={error.length !== 0}>{error}</FormHelperText>}
                    </FormControl>

                    <IconButton data-index={index} className={classes.icon} onClick={this.handleRemoveEmail}>
                        <ClearIcon />
                    </IconButton>
                </div>
            )
        })

        return (
            <div className={classes.container}>
                <AppBar position="static" className={classes.appbar}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            Novo exame
                        </Typography>

                        <Button variant="outlined" color="secondary" className={classes.button} onClick={this.handleSave}>
                            Salvar e transmitir
                        </Button>

                        <Button variant="contained" color="secondary" className={classes.button} onClick={this.handleSaveAndGo}>
                            Salvar exame
                        </Button>
                    </Toolbar>
                </AppBar>

                <Grid container className={classes.grid} justify="center">
                    <Grid item lg={6} md={12} sm={12} className={classes.relative}>
                        <CircularProgress className={classNames({ [classes.progress]: true, [classes.progressHidden]: !busy })} />

                        <form className={classes.form} noValidate autoComplete="off">
                            <Paper className={classes.paper}>
                                <Grid container xs={12} justify="space-between" className={classNames({[classes.pageBusy]: busy })}>
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
                                        <div className={classes.dateAndTime}>
                                            <Input type="date" className={classes.inputDate} value={date} onChange={this.handleDataChanged} />

                                            <Input type="time" className={classes.inputTime} value={time} onChange={this.handleTimeChanged} />
                                        </div>
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
                                                <FormControl error={phoneError.length !== 0}>
                                                    <Input value={phone} className={classes.telefone} inputComponent={TextMaskCustom} onChange={this.handlePhoneChanged} />
                                                    <FormHelperText error={phoneError.length !== 0}>{phoneError}</FormHelperText>
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
                                                <FormControl error={emailError.length !== 0}>
                                                    <Input value={email} className={classes.email} placeholder="exemplo@exemplo.com" />
                                                    <FormHelperText error={emailError.length !== 0}>{emailError}</FormHelperText>
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
            </div>
        )
    }
}

NewExam.propTypes = {
    busy: PropTypes.bool,
    clientName: PropTypes.string,
    clientNameError: PropTypes.string,
    datetime: PropTypes.string,
    email: PropTypes.string,
    emailError: PropTypes.string,
    extraEmails: PropTypes.arrayOf(PropTypes.string),
    extraEmailsError: PropTypes.arrayOf(PropTypes.string),
    extraPhones: PropTypes.arrayOf(PropTypes.string),
    phone: PropTypes.string,
    phoneError: PropTypes.string,
    onSave: PropTypes.func,
}

NewExam.defaultProps = {
    busy: false,
    clientName: '',
    clientNameError: '',
    datetime: '',
    email: '',
    emailError: '',
    extraEmails: [],
    extraEmailsError: [],
    extraPhones: [],
    phone: '',
    phoneError: '',
    onSave: () => console.info('NewExam:onSave is not bound!')
}

export default withStyles(styles)(NewExam)

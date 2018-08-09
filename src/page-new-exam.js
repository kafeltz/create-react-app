import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import FormHelperText from '@material-ui/core/FormHelperText'
import MaskedInput from 'react-text-mask'
import PropTypes from 'prop-types'
import SvgIcon from '@material-ui/core/SvgIcon'
import AddCircle from '@material-ui/icons/AddCircle'
import ClearIcon from '@material-ui/icons/Clear'
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import classNames from 'classnames'
import IconButton from '@material-ui/core/IconButton'
import FormControl from '@material-ui/core/FormControl'
import guid from './guid.js'

const styles = theme => {
    return {
        paper: {
            padding: theme.spacing.unit * 3,
            position: 'relative',
        },
        pageBusy: {
            opacity: 0.3,
            pointerEvents: 'none',
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            marginTop: theme.spacing.unit * 3,
            // width: 400,
        },
        formControl: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            marginTop: theme.spacing.unit * 3,
            // width: 400,
        },
        field: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.unit * 3,
        },
        fieldsInfo: {
            width: 200,
        },
        input: {
            width: 300,
        },
        dateAndTime: {
            width: 300,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
        },
        inputDate: {
            width: 155,
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
        button: {
            color: '#FFF',
        },
        flex: {
            flexGrow: 1,
        },
        appbar: {
            marginBottom: 20,
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

class NewExam extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            busy: props.busy,
            extraPhones: props.extraPhones,
            extraEmails: props.extraEmails,
            phone: '',
        }

        this.handleAddPhone = this.handleAddPhone.bind(this)
        this.handleRemovePhone = this.handleRemovePhone.bind(this)
        this.handleAddEmail = this.handleAddEmail.bind(this)
        this.handleRemoveEmail = this.handleRemoveEmail.bind(this)
        this.handlePhoneChanged = this.handlePhoneChanged.bind(this)
        this.handleExtraPhoneChanged = this.handleExtraPhoneChanged.bind(this)
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

        const { extraEmails } = this.state

        const newEmail = [...extraEmails, '']

        this.setState({
            extraEmails: newEmail,
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
        const { extraEmails } = this.state
        const newExtraEmail = extraEmails.filter((number, i) => i !== index)

        this.setState({
            extraEmails: newExtraEmail,
        })
    }

    handleExtraPhoneChanged(e, index) {
        e.stopPropagation()

        const { extraPhones } = this.state
        const value = e.currentTarget.value

        extraPhones[index] = value

        this.setState({ extraPhones: extraPhones })
    }

    render() {
        const { classes } = this.props
        const { busy, extraPhones, extraEmails, phone } = this.state

        const phones = extraPhones.map((p, index) => {
            const { extraPhones } = this.state
            const value = extraPhones[index]

            return (
                <div className={classes.inputWithAddIcon} key={`phone_key_${index}`}>
                    <FormControl>
                        <Input className={classes.telefone} inputComponent={TextMaskCustom} value={value} onChange={e => this.handleExtraPhoneChanged(e, index)} />
                        <FormHelperText></FormHelperText>
                    </FormControl>

                    <IconButton data-index={index} className={classes.icon} onClick={this.handleRemovePhone}>
                        <ClearIcon />
                    </IconButton>
                </div>
            )
        })

        const emails = extraEmails.map((e, index) => {
            return (
                <div className={classes.inputWithAddIcon} key={`email_key_${index}`}>
                    <FormControl>
                        <Input className={classes.email} placeholder="exemplo@exemplo.com" />
                        <FormHelperText error id="name-error-text"></FormHelperText>
                    </FormControl>

                    <IconButton data-index={index} className={classes.icon} onClick={this.handleRemoveEmail}>
                        <ClearIcon />
                    </IconButton>
                </div>
            )
        })

        return (
            <React.Fragment>
                <AppBar position="static"  className={classes.appbar}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            Novo exame
                        </Typography>

                        <Button className={classes.button}>
                            Salvar e transmitir
                        </Button>

                        <Button className={classes.button}>
                            Salvar exame
                        </Button>
                    </Toolbar>
                </AppBar>

                <Grid container spacing={24}>
                    <Grid item xs={12} className={classes.relative}>
                        <CircularProgress className={classNames({ [classes.progress]: true, [classes.progressHidden]: !busy })} />

                        <Paper className={classes.paper}>
                            <Grid container className={classNames({[classes.pageBusy]: busy })}>
                                <Grid item xs={12}>
                                    <form className={classes.container} noValidate autoComplete="off">
                                        <div className={classes.field}>
                                            <div className={classes.fieldsInfo}>
                                                <Typography color="textPrimary" variant="body1">
                                                    Nome do paciente
                                                </Typography>

                                                <Typography color="textSecondary"  variant="body1">
                                                    Nome completo do paciente para identificá-lo no dia do exame
                                                </Typography>
                                            </div>
                                            <Input className={classes.input} />
                                        </div>

                                        <div className={classes.field}>
                                            <div className={classes.fieldsInfo}>
                                                <Typography color="textPrimary" variant="body1">
                                                    Data e hora
                                                </Typography>

                                                <Typography color="textSecondary"  variant="body1">
                                                    Informe o dia e hora da reunião
                                                </Typography>
                                            </div>

                                            <div className={classes.dateAndTime}>
                                                <Input type="date" className={classes.inputDate} />

                                                <Input type="time" className={classes.inputTime} />
                                            </div>
                                        </div>

                                        <div className={classes.field}>
                                            <div className={classes.fieldsInfo}>
                                                <Typography color="textPrimary" variant="body1">
                                                    Telefones
                                                </Typography>

                                                <Typography color="textSecondary"  variant="body1">
                                                    Telefones que irão receber o SMS com o link da transmissão
                                                </Typography>
                                            </div>

                                            <div className={classes.phones}>
                                                <div className={classes.inputWithAddIcon}>
                                                    <FormControl>
                                                        <Input value={phone} className={classes.telefone} inputComponent={TextMaskCustom} onChange={this.handlePhoneChanged} />
                                                        <FormHelperText error id="name-error-text"></FormHelperText>
                                                    </FormControl>
                                                </div>

                                                {phones}

                                                <Button size="small" color="secondary" onClick={this.handleAddPhone}>
                                                    Adicionar telefone
                                                </Button>
                                            </div>
                                        </div>

                                        <div className={classes.field}>
                                            <div className={classes.fieldsInfo}>
                                                <Typography color="textPrimary" variant="body1">
                                                    E-mails
                                                </Typography>

                                                <Typography color="textSecondary"  variant="body1">
                                                    E-mails que irão receber o link da transmissão
                                                </Typography>
                                            </div>

                                            <div className={classes.emails}>
                                                <div className={classes.inputWithAddIcon}>
                                                    <FormControl>
                                                        <Input className={classes.email} placeholder="exemplo@exemplo.com" />
                                                        <FormHelperText error id="name-error-text"></FormHelperText>
                                                    </FormControl>
                                                </div>

                                                {emails}

                                                <Button size="small" color="secondary" onClick={this.handleAddEmail}>
                                                    Adicionar e-mail
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

NewExam.propTypes = {
    busy: PropTypes.bool,
    extraPhones: PropTypes.arrayOf(PropTypes.string),
    extraEmails: PropTypes.arrayOf(PropTypes.string),
}

NewExam.defaultProps = {
    busy: false,
    extraPhones: [],
    extraEmails: [],
}

export default withStyles(styles)(NewExam)


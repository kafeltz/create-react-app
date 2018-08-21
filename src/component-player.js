import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import is from 'is_js'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { toDate } from './lib/date.js'

const height = 175
const zIndex = 10000 // por algo que ainda não conheço no material-design, esse valor precisa ser alto pra funcionar

const styles = theme => ({
    description: {
        '&:hover': {
            opacity: 0.8,
        },
        background: 'black',
        height: '100%',
        opacity: 0,
        padding: theme.spacing.unit * 2,
        position: 'absolute',
        width: '100%',
        zIndex: zIndex + 2,
    },
    descriptionFont: {
        color: 'white',
    },
    player: {
        background: 'black',
        bottom: 20,
        cursor: 'pointer',
        display: 'block',
        height: height,
        left: 343,
        position: 'fixed',
        width: 300,
        zIndex: zIndex,
    },
    playerInvisible: {
        display: 'none',
    },
    tagVideo: {
        height: '100%',
        position: 'absolute',
        width: '100%',
        zIndex: zIndex + 1,
    },
})

const Player = ({
    classes,
    dom,
    onClick,
    patientEmails,
    patientName,
    patientPhones,
    patientScheduled,
    visible,
}) => {
    return (
        <div className={classnames(classes.player, { [classes.playerInvisible]: !visible })} onClick={onClick}>
            <div className={classes.description}>
                <Typography gutterBottom={true} className={classes.descriptionFont}>{patientName}</Typography>
                {!is.empty(patientScheduled) && <Typography gutterBottom={true} className={classes.descriptionFont}>{toDate(patientScheduled)}</Typography>}
                {!is.empty(patientEmails) && <Typography gutterBottom={true} className={classes.descriptionFont}>{patientEmails.join(', ')}</Typography>}
                {!is.empty(patientPhones) && (patientPhones.length === 1 && patientPhones[0] === '') && <Typography gutterBottom={true} className={classes.descriptionFont}>{patientPhones.join(', ')}</Typography>}
            </div>

            <video ref={r => dom(r)} className={classes.tagVideo} muted autoPlay />
        </div>
    )
}

Player.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    patientEmails: PropTypes.arrayOf(PropTypes.string),
    patientName: PropTypes.string,
    patientPhones: PropTypes.arrayOf(PropTypes.string),
    patientScheduled: PropTypes.string,
    visible: PropTypes.bool,

}

Player.defaultProps = {
    onClick: () => console.info('Player.onClick is not bound!'),
    patientEmails: [],
    patientName: 'Paciente',
    patientPhones: [],
    patientScheduled: '',
    visible: true,
}

export default withStyles(styles)(Player)


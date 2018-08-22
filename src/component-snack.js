import React from 'react'
import PropTypes from 'prop-types'

import CloseIcon from '@material-ui/icons/Close'
import green from '@material-ui/core/colors/green'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => {
    return {
        snackbarError: {
            backgroundColor: theme.palette.error.dark,
        },
        snackbarSuccess: {
            backgroundColor: green[600],
        },
    }
}

const Snack = ({
    classes,
    onClose,
    snackbarMessage,
    snackbarOpen,
    type,
}) => {

    let className = classes.snackbarSuccess

    if (type === 'success') {
        className = classes.snackbarSuccess
    } else if (type === 'error') {
        className = classes.snackbarError
    }

    return (
        <Snackbar
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={onClose}
        >
            <SnackbarContent
                className={className}
                message={snackbarMessage}
                action={[
                    <IconButton onClick={onClose} color="inherit" key="close">
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        </Snackbar>
    )
}

Snack.propTypes = {
    snackbarMessage: PropTypes.string,
    snackbarOpen: PropTypes.bool,
    type: PropTypes.oneOf(['success', 'error']),
}

Snack.defaultProps = {
    snackbarMessage: '',
    snackbarOpen: false,
    type: 'success',
}

export default withStyles(styles)(Snack)

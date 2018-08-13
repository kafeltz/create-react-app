import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import { withStyles } from '@material-ui/core/styles'
import logo from './vlab-logo-dark.png'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import SettingsSharpIcon from '@material-ui/icons/SettingsSharp'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { Link } from 'react-router-dom'

const styles = theme => ({
    logoBackground: {
        height: 64,
        background: theme.palette.primary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolbarListItemText: {
        color: 'red',
    },
    drawerPaper: {
        position: 'relative',
        width: '100%',
    },
    logo: {
        width: '72px',
        height: '17px',
        filter: 'brightness(0) invert(1)',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        display: 'flex',
    },
})

const Menu = ({ classes }) => {
    const linkToScheduled = props => {
        const to = {
            pathname: '/dashboard',
        }

        return <Link to={to}  {...props} />
    }

    const linkToDone = props => {
        const to = {
            pathname: '/dashboard',
            search: '?filter=done',
        }

        return <Link to={to}  {...props} />
    }

    return (
        <Drawer
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.logoBackground}>
                <img src={logo} className={classes.logo} alt="vlab" />
            </div>

            <Divider />

            <List>
                <ListItem>
                    <ListItemText secondary="Exames" />
                </ListItem>

                <ListItem button component={linkToScheduled}>
                    <ListItemText inset primary="Agendados" />
                </ListItem>

                <ListItem button component={linkToDone}>
                    <ListItemText inset primary="Realizados" />
                </ListItem>
            </List>

            <Divider />

            <ListItem button>
                <ListItemIcon>
                    <SettingsSharpIcon />
                </ListItemIcon>

                <ListItemText primary="Configurações" />
            </ListItem>
        </Drawer>
    )
}

Menu.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Menu)

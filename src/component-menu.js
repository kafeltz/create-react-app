import React from 'react'
import PropTypes from 'prop-types'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import { withStyles } from '@material-ui/core/styles'
import logo from './assets/vlab-logo-dark.png'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import SettingsSharpIcon from '@material-ui/icons/SettingsSharp'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { Link } from 'react-router-dom'

export const drawerWidth = 260

const styles = theme => ({
    content: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
    },
    logo: {
        filter: 'brightness(0) invert(1)',
        height: '17px',
        width: '72px',
    },
    logoBackground: {
        alignItems: 'center',
        background: theme.palette.primary.main,
        display: 'flex',
        height: 64,
        justifyContent: 'center',
    },
    toolbar: theme.mixins.toolbar,
    toolbarListItemText: {
        color: 'red',
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

    const linkToConfig = props => <Link to="/config" {...props} />

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
                    <ListItemText inset primary="Gravados" />
                </ListItem>
            </List>

            <Divider />

            <ListItem button component={linkToConfig}>
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

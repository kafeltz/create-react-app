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
import PageNewExam from './page-new-exam.js'

const drawerWidth = 300

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
        width: drawerWidth,
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
    page: {
        width: `calc(100% - ${drawerWidth}px)`,
    },
})

class Dashboard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { classes } = this.props

        const drawer = (
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

                    <ListItem button>
                        <ListItemText inset primary="Agendados" />
                    </ListItem>

                    <ListItem button>
                        <ListItemText inset primary="Realizados" className={classes.toolbarListItemText} />
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

        const page = (
            <div className={classes.page}>
                <PageNewExam />
            </div>
        )

        return (
            <div className={classes.content}>
                {drawer}
                {page}
            </div>
        )
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Dashboard)

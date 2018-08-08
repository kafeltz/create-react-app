import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button'

import PageToken from './page-token.js'

const PAGE_TOKEN = 'token'
const PAGE_DASHBOARD = 'dashboard'

const styles = theme => ({
    root: {
        padding: 10,
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
    paper: {
        padding: theme.spacing.unit * 1,
    },
    listItemText: {
        textAlign: 'left',
    }
});

class PagePlaygrounds extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            page: PAGE_TOKEN,
        }

        this.handlePageClick = this.handlePageClick.bind(this)
    }

    handlePageClick(e) {
        this.setState({
            page: e.currentTarget.dataset.page,
        })
    }

    render() {
        const { classes } = this.props
        const { page } = this.state

        const pageToRender = () => {
            const pageToken1 = <PageToken />
            const pageToken2 = <PageToken error="Token inválido" />
            const pageToken3 = <PageToken busy={true} />

            if (page === PAGE_TOKEN) {
                return (
                    <React.Fragment>
                        {pageToken1}
                        {pageToken2}
                        {pageToken3}
                    </React.Fragment>
                )
            } else if (page === PAGE_DASHBOARD) {
                return null
            }
        }

        // menu selecionado deixar vermelho (secondary)
        // menu não selecionado deixar azul (primary)
        const menuItemClass = id => {
            return id === page ? 'secondary' : 'primary'
        }

        return (
            <div className={classes.root}>
                <Grid container spacing={16}>
                    <Grid item xs={1}>
                        <Paper className={classes.paper}>
                            <List component="nav">
                                <ListItem >
                                    <ListItemText>
                                        <Button color={menuItemClass(PAGE_TOKEN)} className={classes.listItemText} onClick={this.handlePageClick} data-page={PAGE_TOKEN}>
                                            Token
                                        </Button>
                                    </ListItemText>
                                </ListItem>

                                <ListItemText>
                                    <Button color={menuItemClass(PAGE_DASHBOARD)} className={classes.listItemText} onClick={this.handlePageClick} data-page={PAGE_DASHBOARD}>
                                        Dashboard
                                    </Button>
                                </ListItemText>
                            </List>
                        </Paper>
                    </Grid>

                    <Grid item xs={9}>
                        {pageToRender()}
                    </Grid>

                    <Grid item xs={2}>

                    </Grid>
                </Grid>
            </div>
        )
    }
}

PagePlaygrounds.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(PagePlaygrounds)


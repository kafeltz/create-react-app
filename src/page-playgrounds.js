import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'

import PageToken from './page-token.js'
import PageNewExam from './page-new-exam.js'
import PageDashboard from './page-dashboard.js'

const PAGE_TOKEN = 'token'
const PAGE_DASHBOARD = 'dashboard'
const PAGE_NEW_EXAM = 'new-exam'

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
})

class PagePlaygrounds extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            page: PAGE_NEW_EXAM,
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
                return (
                    <React.Fragment>
                        <PageDashboard />
                    </React.Fragment>
                )
            } else if (page === PAGE_NEW_EXAM) {
                return (
                    <React.Fragment>
                        <PageNewExam />
                        <br />
                        <PageNewExam busy={true} />
                        <br />
                        <PageNewExam
                            clientNameError="Você deve informar o nome do cara!"
                            phoneError="Telefone é inválido!"
                            emailError="E-mail é inválido!"
                            datetime="09/08/2018 13:00"
                            extraPhones={ [''] }
                            extraEmails={ ['extra@eventials.com'] }
                            extraEmailsError={ ['Campo inválido!'] }
                        />
                        <br />
                        <PageNewExam
                            clientName="Lorem Ipsum"
                            datetime="09/08/2018 13:00"
                            phone="(47) 98877-5544"
                            email="lorem@ipsum.com.br"
                            extraPhones={ ['(47) 12345-6789'] }
                            extraEmails={ ['extra@eventials.com'] }
                        />
                    </React.Fragment>
                )
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
                    <Grid item xs={2}>
                        <Paper className={classes.paper}>
                            <List component="nav">
                                <ListItem>
                                    <ListItemText>
                                        <Button color={menuItemClass(PAGE_TOKEN)} className={classes.listItemText} onClick={this.handlePageClick} data-page={PAGE_TOKEN}>
                                            Token
                                        </Button>
                                    </ListItemText>
                                </ListItem>

                                <ListItem>
                                    <ListItemText>
                                        <Button color={menuItemClass(PAGE_DASHBOARD)} className={classes.listItemText} onClick={this.handlePageClick} data-page={PAGE_DASHBOARD}>
                                            Dashboard
                                        </Button>
                                    </ListItemText>
                                </ListItem>

                                <ListItem>
                                    <ListItemText inset={true}>
                                        <Button color={menuItemClass(PAGE_NEW_EXAM)} className={classes.listItemText} onClick={this.handlePageClick} data-page={PAGE_NEW_EXAM}>
                                            Novo Exame
                                        </Button>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>

                    <Grid item xs={8}>
                        {pageToRender()}
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


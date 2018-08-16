import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'

import PageHome from './page-home.js'
import PageDashboard from './page-dashboard.js'
import PageNewExam from './page-new-exam.js'
import PageToken from './page-token.js'
import PagePlaygrounds from './page-playgrounds.js'
import PageConfig from './page-config.js'
import PageTransmission from './page-transmission.js'

import './App.css'
import 'typeface-roboto'

const theme = createMuiTheme({
    overrides: {
        MuiButton: {
            containedSecondary: {
                color: 'white',
            },
            textPrimary: {
                color: '#006fb6',
            },
        },
    },
    palette: {
        primary: {
            main: '#00AEEF',
        },
        secondary: {
            main: '#00CF74',
            // dark: '#006fb6',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
})

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tokenIsValid: false,
        }
    }

    render() {
        const newExamData = {}

        // const newExamData = {
            // clientName: 'Lorem Ipsum',
            // datetime: '2018-08-15 16:21',
            // email: 'um@email.com',
            // extraEmails: ['dois@email.com'],
            // phone: '(47) 12345-6789',
            // extraPhones: ['(47) 55555-6666'],
        // }

        return (
            <MuiThemeProvider theme={theme}>
                <Router>
                    <React.Fragment>
                        <CssBaseline />

                        <Route exact path="/" component={PageHome} />
                        <Route path="/dashboard" render={ props => <PageDashboard route={{...props}} {...newExamData} /> } />
                        <Route path="/new-exam" render={ props => <PageNewExam route={{...props}} {...newExamData} /> } />
                        <Route path="/token" component={PageToken} />
                        <Route path="/config" component={PageConfig} />
                        <Route path="/transmission" component={PageTransmission} />

                        <Route path="/playgrounds" component={PagePlaygrounds} />
                    </React.Fragment>
                </Router>
            </MuiThemeProvider>
        )
    }
}

export default App

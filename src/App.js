import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'

import PageConfig from './page-config.js'
import PageDashboard from './page-dashboard.js'
import PageHome from './page-home.js'
import PageNewExam from './page-new-exam.js'
import PagePlaygrounds from './page-playgrounds.js'
import PageToken from './page-token.js'
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
        return (
            <MuiThemeProvider theme={theme}>
                <Router>
                    <React.Fragment>
                        <CssBaseline />

                        <Route exact path="/" component={PageHome} />
                        <Route path="/dashboard" render={ props => <PageDashboard route={{...props}} /> } />
                        <Route path="/new-exam" render={ props => <PageNewExam route={{...props}} /> } />
                        <Route path="/token" component={PageToken} />
                        <Route path="/config" component={PageConfig} />
                        <Route path="/transmission/:id" render={ props => <PageTransmission route={{...props}} /> } />

                        <Route path="/playgrounds" component={PagePlaygrounds} />
                    </React.Fragment>
                </Router>
            </MuiThemeProvider>
        )
    }
}

export default App

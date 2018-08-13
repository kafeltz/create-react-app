import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'

import PageHome from './page-home.js'
import PageDashboard from './page-dashboard.js'
import PageNewExam from './page-new-exam.js'
import PageToken from './page-token.js'
import PagePlaygrounds from './page-playgrounds'

import './App.css'
import 'typeface-roboto'

const theme = createMuiTheme({
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
    overrides: {
        MuiButton: {
            containedSecondary: {
                color: 'white',
            },
        },
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
                        <Route path="/dashboard" component={PageDashboard} />
                        <Route path="/new-exam" component={PageNewExam} />
                        <Route path="/token" component={PageToken} />

                        <Route path="/playgrounds" component={PagePlaygrounds} />
                    </React.Fragment>
                </Router>
            </MuiThemeProvider>
        )
    }
}

export default App

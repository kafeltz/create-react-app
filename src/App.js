import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import CssBaseline from '@material-ui/core/CssBaseline'

import PageHome from './page-home.js'
import PageDashboard from './page-dashboard.js'
import PageToken from './page-token.js'
import PagePlaygrounds from './page-playgrounds'

import './App.css'
import 'typeface-roboto'

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tokenIsValid: false,
        }
    }

    render() {
        return (
            <Router>
                <React.Fragment>
                    <CssBaseline />
                    <Route exact path="/" component={PageHome} />
                    <Route path="/dashboard" component={PageDashboard} />
                    <Route path="/token" component={PageToken} />

                    <Route path="/playgrounds" component={PagePlaygrounds} />
                </React.Fragment>
            </Router>
        )
    }
}


export default App

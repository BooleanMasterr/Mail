import axios from 'axios';
import React from 'react';
import Inbox from './modules/Inbox';
import Compose from './modules/Compose';
import Details from './modules/Details';
import { BrowserRouter as Router, Link } from 'react-router-dom';

import './App.css';

export default class App extends React.Component {

    constructor() {
        super();
        this.state = {
            emails: [],
            sent: false,
            __module: 'inbox',
            id: 0
        }
    }

    componentDidMount() {
        this.loadMailbox('inbox');
        console.log('mounted');
    }


    loadMailbox = (mailbox) => {
        axios.get(`mail/${mailbox}/`)
        .then(response => response.data)
        .then(data => {
            mailbox === 'sent' ?
                this.setState({
                    emails: data,
                    sent: true,
                    __module: mailbox
                })
            :this.setState({
                emails: data,
                __module: mailbox
            });
        })

    }

    loadModule = (module_, id=0) => {
        this.setState({
            __module: module_,
            id: id 
        })
    }


    renderModule = () => {
        if (this.state.__module === 'compose') {
            return <Compose />
        } else if (this.state.__module === 'details') {
            return (
                <Details id={this.state.id} loadModule={this.loadModule}/>
            )
        } else {
            return (
                <Inbox 
                    sent={this.state.sent}
                    emails={this.state.emails}
                    mailbox={this.state.__module}
                    loadModule={this.loadModule}
                />
            )
        }
    }


    render() {

        return (
            <Router>
                <div>
                    <ul className="navbar__container">
                        <li className="navbar__item">
                            <Link to="" onClick={() => this.loadMailbox('inbox')}>
                                Inbox
                            </Link>
                        </li>
                        <li className="navbar__item">  
                            <Link to="" onClick={() => this.loadModule('compose')}>
                                Compose
                            </Link>
                        </li>
                        <li className="navbar__item">
                            <Link to="" onClick={() => this.loadMailbox('sent')}>
                                Sent 
                            </Link>
                        </li>
                        <li className="navbar__item">
                            <Link to="" onClick={() => this.loadMailbox('archive')}>
                                Archive 
                            </Link>
                        </li>
                        <li className="navbar__item__right">
                            <Link to="/logout" onClick={() => window.location.replace('/logout')}>
                                Logout
                            </Link>
                        </li>
                    </ul>
                    <div id="container">
                        {this.renderModule()}
                    </div>
                </div>
            </Router>
        );
    }
}
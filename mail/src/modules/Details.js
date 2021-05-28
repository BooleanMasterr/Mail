import React from 'react';
import axios from 'axios';

export default class Details extends React.Component {

    constructor() {
        super();
        this.state = {
            email: {}
        }
    }

    loadModule = (module_, id=0) => {
        this.props.loadModule(module_, id)
    }

    componentDidMount() {
        axios.get(`/emails/${this.props.id}/`)
        .then(response => response.data)
        .then(data => {
            this.setState({
                email: data 
            })
        })
    }

    getDisplayText = () => {
        if (this.state.email.archived === true) {
            return ('Unarchive');
        } else {
            return ('Archive');
        }
    }

    archiveOnClick = () => {
        axios.put(`/emails/${this.state.email.id}/`, {
            body: {
                archived: !this.state.email.archived
            }
        })
        if (this.getDisplayText() === 'Archive') {
            this.loadModule('archive');
        } else {
            this.loadModule('inbox');
        }
        
    } 


    render() {

        return (
            <div className="container">
                <h1>{this.state.email.subject}</h1>
                <p>Sender: {this.state.email.sender}</p>
                <p>Recipients: {this.state.email.recipients}</p>
                <p>{this.state.email.body}</p>
                <p>{this.state.email.timestamp}</p>    
                <button className="btn btn-outline-primary" onClick={this.archiveOnClick}>
                    {this.getDisplayText()}
                </button>            
                <hr />
            </div>
        );      
    }
}
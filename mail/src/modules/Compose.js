import React from 'react';
import axios from 'axios';

export default class Compose extends React.Component {

    constructor() {
        super();
        this.state = {
            recipients: '',
            subject: '',
            body: ''
        }
    }

    onChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value 
        })
    }

    onClick = (event) => {
        event.preventDefault();
        axios.post('/compose/', {
            body: {
                recipients: this.state.recipients,
                subject: this.state.subject,
                body: this.state.body 
            }
        }).then(response => response)
        .then(data => console.log(data))
    }

    render() {

        return (
            <form>
                <h1>Compose</h1>
                <br />
                <input 
                    name="subject"
                    value={this.state.subject}
                    onChange={this.onChange}
                    placeholder='Subject'
                    className='form-control'
                />
                <br />
                <textarea 
                    name="body"
                    value={this.state.body}
                    onChange={this.onChange}
                    placeholder='Body'
                    className='form-control'
                />
                <br />
                <input 
                    name="recipients"
                    value={this.state.recipients}
                    onChange={this.onChange}
                    placeholder='Recipients'
                    className='form-control'
                />
                <br />
                <button className="btn btn-outline-primary" onClick={this.onClick}>
                    Send 
                </button>
            </form>
        );
    }
}
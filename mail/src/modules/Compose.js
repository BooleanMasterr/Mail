import React from 'react';
import axios from 'axios';

export default class Compose extends React.Component {

    constructor() {
        super();
        this.state = {
            recipients: '',
            subject: '',
            body: '',
            errors: '',
            messages: ''
        }
    }

    componentDidMount() {
        var propsExist = this.props.properties.defaultSubject === undefined ? false : true;
        const { defaultSubject, defaultBody, defaultRecipients } = this.props.properties;
        propsExist === true ?
            this.setState({
                recipients: defaultRecipients,
                subject: defaultSubject,
                body: defaultBody 
            })
        :null 
    }

    onChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value 
        })
    }

    getUser = () => {
        var userEmail = document.getElementById('user_email');
        return (
            userEmail.innerHTML.slice(1, -1)
        )
    }

    onClick = (event) => {
        event.preventDefault();
        axios.post('/compose/', {
            body: {
                recipients: this.state.recipients,
                subject: this.state.subject,
                body: this.state.body 
            }
        }).then(response => response.data)
        .then(data => {
            if (data.message) {
                this.setState({
                    messages: data.message,
                    errors: '' 
                })
            } else {
                this.setState({
                    errors: data.error,
                    messages: ''
                })
            }
        })
    }

    render() {

        return (
            <form className="container">
                {
                    this.state.errors !== '' ?
                    <div className="alert alert-danger" role="alert">
                        {this.state.errors}
                    </div>
                    :null 
                }
                {
                    this.state.messages !== ''?
                    <div className="alert alert-success" role="alert">
                        {this.state.messages}
                    </div>
                    :null
                }
                <h1>Compose</h1>
                <hr />
                <br />
                <input 
                    readOnly={true}
                    defaultValue={`From: ${this.getUser()}`}
                    className="form-control"
                />
                <br/>
                <input 
                    name="recipients"
                    value={this.state.recipients}
                    onChange={this.onChange}
                    placeholder='Recipients'
                    className='form-control'
                />
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
                <button className="btn btn-outline-primary" onClick={this.onClick}>
                    Send 
                </button>
            </form>
        );
    }
}
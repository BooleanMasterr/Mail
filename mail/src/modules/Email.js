import React from 'react';

export default class Email extends React.Component {


    loadModule = (module_, id=0) => {
        this.props.loadModule(module_, id)
    }


    render() {
         
        return (
            <div className={`email__container container read__${this.props.read}`} >

                <div>
                    <h1>{this.props.subject}</h1>
                    <p>Sender: {this.props.sender}</p>
                    <p>Recipients: {this.props.recipients.join(',')}</p>
                    <p>{this.props.body}</p>
                    <p>{this.props.timestamp}</p>
                    {
                        document.getElementById('user_email').innerHTML.slice(1, -1) !== this.props.sender ? 
                        <button className="btn btn-outline-primary" onClick={() => this.loadModule('details', this.props.id)}>
                            View Details 
                        </button>
                        :null 
                    }
                </div>
            </div>
        )
    }
}

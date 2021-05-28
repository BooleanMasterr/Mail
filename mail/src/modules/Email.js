import React from 'react';

export default class Email extends React.Component {

    constructor() {
        super();
        this.state = {
            sent: ''
        }
    }

    componentDidUpdate(props) {
        if (props.sent !== this.props.sent) {
            this.setState({
                value: this.props.sent
            })
        }
    }

    loadModule = (module_, id=0) => {
        this.props.loadModule(module_, id)
    }

    render() {
         
        return (
            <div className={`email__container container`}>
                {
                    this.state.sent === true ? 
                    <div>
                        <h1>{this.props.subject}</h1>
                        <p>Sender: {this.props.sender}</p>
                        <p>Recipients: {this.props.recipients}</p>
                        <p>{this.props.body}</p>
                        <p>{this.props.timestamp}</p>
                    </div>
                    :
                    <div>
                        <h1>{this.props.subject}</h1>
                        <p>Sender: {this.props.sender}</p>
                        <p>Recipients: {this.props.recipients}</p>
                        <p>{this.props.body}</p>
                        <p>{this.props.timestamp}</p>
                        <button className="btn btn-outline-primary" onClick={() => this.loadModule('details', this.props.id)}>
                            View Details 
                        </button>
                    </div>
                }
            </div>
        )
    }
}

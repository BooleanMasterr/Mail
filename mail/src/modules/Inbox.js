import React from 'react';

import Email from './Email';

export default class Inbox extends React.Component {


    loadModule = (module_, id=0) => {
        this.props.loadModule(module_, id)
    }

    render() {
        return (
            <div>
                <h3 className="ml-2">{`${this.props.mailbox[0].toUpperCase()}${this.props.mailbox.slice(1)}`}</h3>
                <hr />
                {this.props.emails.map(email => (
                    <Email 
                        subject={email.subject}
                        sender={email.sender}
                        recipients={email.recipients}
                        body={email.body}
                        timestamp={email.timestamp}
                        loadModule={this.loadModule}
                        read={email.read}
                        key={email.id}
                        id={email.id}
                    />
                ))}
            </div>
        )
    }
}
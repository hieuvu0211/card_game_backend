import React, { Component } from 'react'

export default class EventLog extends Component {
    
    render() {
        return (
            <div className=" h-40 overflow-y-scroll">
                <div className=" flex items-center justify-center">Event Log</div>
                <div className=" flex flex-col items-start justify-start ">
                   {this.props.logs.map((x, index) => {
                        if(index === this.props.logs.length-1){
                            return <p className="new">{x}</p>
                        }
                    return <p>{x}</p>
                    })}
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div> 
                </div>
            </div>
        )
    }

    // scrollToBottom = () => {
    //     this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    //   }
      
    //   componentDidMount() {
    //     this.scrollToBottom();
    //   }
      
    //   componentDidUpdate() {
    //     this.scrollToBottom();
    //   }
}
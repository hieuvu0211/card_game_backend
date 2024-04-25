import React, { Component} from "react";
export default class ExchangeInfluences extends Component {
    constructor(props) {
        super(props)
        this.state = {
            influences: props.influences,
            keep: [],
            totalInf: props.influences.length,
        }
    }
    selectInfluence = (index) => {
        this.state.keep(this.state.influences.splice(index, 1)[0])
        this.setState({ influences: this.state.influences, putback: this.state.putback})
        if(this.state.keep.length === (this.state.totalInf-2)) {
            const res = {
                playerName: this.props.name,
                kept: this.state.keep,
                putback: this.state.influences
            }
            this.props.socket.emit('game-chooseExchangeDecision', res);
            this.props.doneExchangeInfluence();
        }
    }
    render() {
        const influences = this.state.influences.map((x, index) => {
            return <button key={index} onClick={() => this.selectInfluence(index)}>{x}</button>
        })
        return (
            <div>
                <p>Choose which influence(s) to keep</p>
                {influences}
            </div>
        )
    }
}
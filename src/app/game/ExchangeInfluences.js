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
        this.state.keep.push(this.state.influences.splice(index, 1)[0])
        this.setState({ influences: this.state.influences, putBack: this.state.putback})
        if(this.state.keep.length === (this.state.totalInf-2)) {
            const res = {
                playerName: this.props.name,
                kept: this.state.keep,
                putBack: this.state.influences
            }
            this.props.socket.emit('game-chooseExchangeDecision', res);
            this.props.doneExchangeInfluence();
        }
    }
    render() {
        const influences = this.state.influences.map((x, index) => {
            return <button className=" w-24 hover:bg-slate-500 hover:border-slate-500 rounded-md" key={index} onClick={() => this.selectInfluence(index)}>{x}</button>
        })
        return (
            <div className=" flex flex-col items-center justify-center">
                <p className=" font-bold my-2">Choose which influence(s) to keep</p>
                <div className=" grid grid-cols-2 grid-rows-2">
                {influences}
                </div>

            </div>
        )
    }
}
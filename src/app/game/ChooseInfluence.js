import React, {Component} from "react";
export default class ChooseInfluence extends Component {
    selectInfluence = (influence) => {
        const res = {
            influence: influence,
            playerName: this.props.name,
        }
        console.log(res)
        this.props.socket.emit('game-chooseInfluenceDecision', res);
        this.props.doneChooseInfluence();
    }
    render() {
        const influences = this.props.influences.map((x, index) => {
            return <button id={`${x}`} key={index} onClick={() => this.selectInfluence(x)}>{x}</button>
        })
        return (
            <div>
                <p>Choose an influence to lose</p>
                {influences}
            </div>
        )
    }
}
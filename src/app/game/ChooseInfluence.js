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
            return <button className=" mx-2 hover:bg-slate-500 hover:border-slate-500 rounded-md w-28" id={`${x}`} key={index} onClick={() => this.selectInfluence(x)}>{x}</button>
        })
        return (
            <div className=" flex flex-col items-center justify-center">
                <p className=" font-bold">Choose an influence to lose</p>
                <div className=" flex flex-row items-center justify-center">
                    {influences}
                </div>
            </div>
        )
    }
}
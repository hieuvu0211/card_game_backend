import React, { Component } from 'react';
export default class ActionDecision extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDecisionMade: false,
            decision: '',
            isPickingTarget: false,
            targetAction: '',
            actionError: ''
        }
    }
    chooseAction = (action, target = null) => {
        const res = {
            action: {
                action: action,
                target: target,
                source: this.props.name
            }
        }
        console.log(res)
        this.props.socket.emit('game-actionDecision', res);
        this.props.doneAction();
    }
    deductCoins = (action) => {
        console.log(this.props.money, action);
        if(action === 'assassinate') {
            if(this.props.money >= 3) {
                this.props.deductCoins(3);
                this.pickingTarget('assassinate');
            }
            else {
                this.setState({ actionError: 'Not enough coins to assassinate!'})
            }
        }
        else if (action === 'coup') {
            if(this.props.money >= 7) {
                this.props.deductCoins(7);
                this.pickingTarget('coup');
            }
            else {
                this.setState({ actionError: 'Not enough coins to coup!'})
            }
        }
    }
    pickingTarget = (action) => {
        this.setState({
            isPickingTarget: true,
            targetAction: action,
            actionError: ''
        });
        this.setState({targetAction: action});
    }
    pickTarget = (target) => {
        this.chooseAction(this.state.targetAction, target);
    }
    render() {
        let controls = null
        if(this.state.isPickingTarget) {
            controls = this.props.players.filter(x => !x.isDead).filter(x => x.name !== this.props.name).map((x, index) => {
                return <button className=' hover:bg-slate-500 hover:border-slate-500 rounded-md w-60' key={index} onClick={() => this.pickTarget(x.name)}>{x.name}</button>
            })
        } else if(this.props.money < 10) {
            controls = (
                <>
                <button className=' font-bold min-w-24 min-h-24 mx-2 bg-orange-600 text-black rounded-md px-2' onClick={() => this.chooseAction('income')}>Income</button>
                <button className=' font-bold min-w-24 min-h-24 mx-2 bg-orange-600 text-black rounded-md px-2' onClick={() => this.deductCoins('coup')}>Coup</button>
                <button className=' font-bold min-w-24 min-h-24 mx-2 bg-orange-600 text-black rounded-md px-2' onClick={() => this.chooseAction('foreign_aid')}>Foreign Aid</button>
                <button className=' font-bold min-w-24 min-h-24 mx-2 bg-blue-600 text-black rounded-md px-2' id="captain" onClick={() => this.pickingTarget('steal')}>Steal</button>
                <button className=' font-bold min-w-24 min-h-24 mx-2 bg-black text-red-600 rounded-md px-2' id="assassin" onClick={() => this.deductCoins('assassinate')}>Assassinate</button>
                <button className=' font-bold min-w-24 min-h-24 mx-2 bg-purple-500 text-black rounded-md px-2' id="duke" onClick={() => this.chooseAction('tax')}>Tax</button>
                <button className=' font-bold min-w-24 min-h-24 mx-2 bg-green-500 text-black rounded-md px-2' id="ambassador" onClick={() => this.chooseAction('exchange')}>Exchange</button>
                </>
            )
        }
        else {
            controls = <button onClick={() => this.deductCoins('coup')}>Coup</button>
        }
        return (
            <div className='flex flex-col items-center justify-center'>
                <p className=' font-bold  text-3xl mb-4'>Choose an action</p>
                <div>
                    {controls}
                </div>
                <p className=' font-bold mt-2'>{this.state.actionError}</p>
            </div>
        )
    }
}
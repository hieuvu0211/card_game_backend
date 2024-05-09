import React, { Component } from 'react';
export default class BlockChallengeDecision extends Component {
    vote = (isChallenging) => {
        this.props.closeOtherVotes('chanllenge-block')
        const res = {
            counterAction: this.props.counterAction,
            prevAction: this.props.prevAction,
            isChallenging,
            challengee: this.props.counterAction.source,
            challenger: this.props.name
        }
        console.log(res)
        this.props.socket.emit('game-blockChallengeDecision', res);
        this.props.doneBlockChallengeVote();
    }
    render() {
        return (
            <>
                <p className=' mt-2 font-bold'>{this.props.counterAction.source} is trying to block {this.props.prevAction.action} from {this.props.prevAction.source} as {this.props.counterAction.claim}</p>
                <button className=' my-2 w-60 hover:bg-slate-500 hover:border-slate-500 rounded-md' onClick={() => this.vote(true)}>Challenge</button>
                
            </>
        )
    }
}
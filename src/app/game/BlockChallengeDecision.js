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
                <p>{this.props.counterAction.source} is trying to block {this.props.prevAction}</p>
                <button onClick={() => this.vote(true)}>Challenge</button>
                
            </>
        )
    }
}
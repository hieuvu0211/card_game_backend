import React, { Component } from 'react';
export default class BlockDecision extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDecisionMade: false,
            decision: '',
            isPickingClaim: false,
            targetAction: ''
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
        this.props.socket.emit('game-actionDecision', res)
        this.props.doneAction();
    }
    block = (block, claim = null) => {
        this.props.closeOtherVotes('block')
        let resClaim
        if(claim != null) {
            resClaim = claim;
        }
        else if(block === 'block_foreign_aid') {
            resClaim = 'duke'
        }
        else if(block === 'block_assassinate') {
            resClaim = 'contessa'
        }
        else {
            console.error('unknown claim, line 40')
        }
        const res = {
            prevAction: this.props.action,
            counterAction: {
                counterAction: block,
                claim: resClaim,
                source: this.props.name
            },
            blockee: this.props.action.source,
            blocker: this.props.name,
            isBlocking: true
        }
        console.log(res)
        this.props.socket.emit('game-blockDecision', res)
        this.props.doneBlockVote();
    }
    pass = () => {
        const res = {
            action: this.props.action,
            isBlocking: false,
        }
        console.log(res)
        this.props.socket.emit('game-blockDecision', res)
        this.props.doneBlockVote();
    }
    pickClaim = (block) => {
        this.props.closeOtherVotes('block')
        this.setState({decision: block})
        this.setState({isPickingClaim: true})
    }
    render() {
        let control = null
        let pickClaim = null
        if(!this.state.isPickingClaim) {
            if(this.props.action.action === 'foreign_aid') {
                control = <>
                <p><b>{this.props.action.source} is trying to use Foreign Aid</b></p>
                <button className=' px-2 w-60 rounded-md hover:bg-slate-500 hover:border-slate-500  my-2' onClick={() => this.block('block_foreign_aid')}>Block Foreign Aid</button>
                </>
            }
            else if(this.props.action.action === 'steal') {
                control = <button className=' px-2 w-60 rounded-md hover:bg-slate-500 hover:border-slate-500 mb-2' onClick={() => this.pickClaim('block_steal')}>Block Steal</button>
            }
            else if(this.props.action.action === 'assassinate') {
                control = <button className=' px-2 w-60 rounded-md hover:bg-slate-500 hover:border-slate-500 mb-2' onClick={() => this.block('block_assassinate')}>Block Assassination</button>
            }
        }
        else {
            pickClaim = <>
            <p className=' font-bold'>To block steal, do you claim Ambassador or Captain?</p>
            <button className=' px-2 w-60 rounded-md hover:bg-slate-500 hover:border-slate-500  mt-2' onClick={() => this.block(this.state.decision, 'ambassador')}>Ambassador</button>
            <button className=' px-2 w-60 rounded-md hover:bg-slate-500 hover:border-slate-500 ' onClick={() => this.block(this.state.decision, 'captain')}>Captain</button>
            </>
        }
        return (
            <div className='flex flex-col items-center justify-center mt-2'>
                {control}
                {pickClaim}
            </div>
        )
    }
}
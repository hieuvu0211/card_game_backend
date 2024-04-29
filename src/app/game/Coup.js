import React, { Component} from "react";
import ActionDecision from "./ActionDecision";
import ChallengeDecision from "./ChallengeDecision";
import BlockChallengeDecision from "./BlockChallengeDecision";
import PlayerBoard from "./PlayerBoard";
import RevealDecision from "./RevealDecision";
import BlockDecision from "./BlockDecision";
import ChooseInfluence from "./ChooseInfluence";
import ExchangeInfluences from "./ExchangeInfluences";
export default class Coup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            action: null,
            blockChallengeRes: null,
            players: [],
            playerIndex: null,
            currentPlayer: '',
            isChooseAction: false,
            revealingRes: null,
            blockingAction: null,
            isChoosingInfluence: false,
            exchangeInfluence: null,
            error: '',
            winner: '',
            playAgain: null,
            logs: [],
            isDead: false,
            waiting: true,
            disconnected: false
        }
        const bind = this;
        this.playAgainButton = <>
        <br></br>
        <button onClick={() => {
            this.props.socket.emit('game-playAgain');
        }}>PlayAgain</button>
        </>
        this.props.socket.on('disconnect', reason => {
            this.setState({disconnected: true});
        })
        this.props.socket.on('game-gameOver', (winner) => {
            bind.setState({winner: `${winner} Wins!`})
            bind.setState({playAgain: bind.playAgainButton})
        })
        this.props.socket.on('game-updatePlayers', (players) => {
            bind.setState({playAgain: null})
            bind.setState({winner: null})
            players = players.filter(x => !x.isDead);
            let PI = null;
            for(let i = 0; i < players.length; i++) {
                console.log(players[i].name, this.props.name)
                if(players[i].name === this.props.name) {
                    PI = i;
                    break;
                }
            }
            if(PI == null) {
                this.setState({isDead: true})
            }else {
                this.setState({isDead: false})
            }
            console.log("PI: ", PI)
            console.log(players)
            bind.setState({playerIndex: PI}, () => { console.log(" alo 123: ", bind.state.playerIndex)});
            bind.setState({players: players});

        });
        this.props.socket.on('game-updateCurrentPlayer', (currentPlayer) => {
            console.log('currentPlayer: ', currentPlayer)
            bind.setState({currentPlayer})
        });
        this.props.socket.on('game-chooseAction', () => {
            bind.setState({ isChooseAction: true})
        });
        this.props.socket.on('game-openExchange', (drawTwo) => {
            console.log(drawTwo);

            let influences = drawTwo;
            bind.setState({exchangeInfluence: influences})
        });
        this.props.socket.on('game-openChallenge', (action) => {
            if(this.state.isDead) {
                return
            }
            if(action.source !== bind.props.name) {
                bind.setState({action})
            }else {
                bind.setState({action: null})
            }
        });
        this.props.socket.on('game-openBlockChallenge', (blockChallengeRes) => {
            if(this.state.isDead) {
                return
            }
            if(blockChallengeRes.counterAction.source !== bind.props.name) {
                bind.setState({blockChallengeRes})
            }else {
                bind.setState({blockChallengeRes: null})
            }
        });
        this.props.socket.on('game-openBlock', (action) => {
            if(this.state.isDead) {
                return
            }
            if(action.source !== bind.props.name) {
                bind.setState({blockingAction: action})
            }else {
                bind.setState({blockingAction: null})
            }
        });
        this.props.socket.on('game-chooseReveal', (res) => {
            console.log(res)
            bind.setState({ revealingRes: res})
        });
        this.props.socket.on('game-chooseInfluence', () => {
            bind.setState({isChoosingInfluence: true})
        });
        this.props.socket.on('game-closeChallenge', () => {
            bind.setState({action: null})
        });
        this.props.socket.on('game-closeBlock', () => {
            bind.setState({ blockingAction: null})
        });
        this.props.socket.on('game-closeBlockChallenge', () => {
            bind.setState({blockChallengeRes: null})
        });
    }
        deductCoins = (amount) => {
            let res = {
                source: this.props.name,
                amount: amount
            }
            this.props.socket.emit('game-deductCoins', res)
        };
        doneAction = () => {
            this.setState({
                isChooseAction: false
            })
        };
        doneChallengeBlockingVote = () => {
            this.setState({action: null});
            this.setState({ blockChallengeRes: null});
            this.setState({blockingAction: null});
        };
        closeOtherVotes = (voteType) => {
            if(voteType === 'challenge') {
                this.setState({ blockChallengeRes: null});
                this.setState({blockingAction: null});
            }else if(voteType === 'block') {
                this.setState({action: null});
                this.setState({ blockChallengeRes: null});
            }else if(voteType === 'challenge-block') {
                this.setState({action: null});
                this.setState({ blockingAction: null})
            }
        }
        doneReveal = () => {
            this.setState({ revealingRes: null});
        };
        doneChooseInfluence = () => {
            this.setState({isChoosingInfluence: false});
        };
        doneExchangeInfluence = () => {
            this.setState({exchangeInfluence: null});
        };
        pass = () => {
            if(this.state.action !== null) {
                console.log(this.state.action);
                let res = {
                    isChallenging: false,
                    action: this.state.action
                }
                console.log(res)
                this.props.socket.emit('game-challengeDecision', res);
            }else if(this.state.blockChallengeRes !== null) {
                let res = {
                    isChallenging: false
                }
                console.log(res);
                this.props.socket.emit('game-blockChallengeDecision', res);
            }else if(this.state.blockingAction !== null) {
                const res = {
                    action: this.state.blockingAction,
                    isBlocking: false
                }
                console.log(res);
                this.props.socket.emit('game-blockDecision', res);
            }
            this.doneChallengeBlockingVote();
        }

    influenceColorMap = {
        duke: '#D55DC7',
        captain: '#80C6E5',
        assassin: '#2B2B2B',
        contessa: '#E35646',
        ambassador: '#B4CA1F'
    }
    render() {
        let actionDecision = null
        let currentPlayer = null
        let revealDecision = null
        let challengeDecision = null
        let blockChallengeDecision = null
        let chooseInfluenceDecision = null
        let blockDecision = null
        let influences = null
        let pass = null
        let coins = null
        let exchangeInfluences = null
        let playAgain = null
        let isWaiting = true
        let waiting = null
        if(this.state.isChooseAction && this.state.playerIndex != null) {
            isWaiting = false;
            actionDecision = <ActionDecision doneAction={this.doneAction} deductCoins={this.deductCoins} name={this.props.name} socket={this.props.socket} money={this.state.players[this.state.playerIndex].money} players={this.state.players}></ActionDecision>
        }
        if(this.state.currentPlayer) {
            currentPlayer = <p>It is <b>{this.state.currentPlayer}</b>'s turn</p>
        }
        if(this.state.revealingRes) {
            isWaiting = false;
            revealDecision = <RevealDecision doneReveal={this.doneReveal} name ={this.props.name} socket={this.props.socket} res={this.state.revealingRes} influences={this.state.players.filter(x => x.name === this.props.name)[0].influences}></RevealDecision>
        }
        if(this.state.isChoosingInfluence) {
            isWaiting = false;
            chooseInfluenceDecision = <ChooseInfluence doneChooseInfluence={this.doneChooseInfluence} name ={this.props.name} socket={this.props.socket} influences={this.state.players.filter(x => x.name === this.props.name)[0].influences}></ChooseInfluence>
        }
        if(this.state.action != null || this.state.blockChallengeRes != null || this.state.blockingAction !== null){
            pass = <button onClick={() => this.pass()}>Pass</button>
        }
        if(this.state.action != null) {
            isWaiting = false;
            challengeDecision = <ChallengeDecision closeOtherVotes={this.closeOtherVotes} doneChallengeVote={this.doneChallengeBlockingVote} name={this.props.name} action={this.state.action} socket={this.props.socket} ></ChallengeDecision>
        }
        if(this.state.exchangeInfluence) {
            isWaiting = false;
            exchangeInfluences = <ExchangeInfluences doneExchangeInfluence={this.doneExchangeInfluence} name={this.props.name} influences={this.state.exchangeInfluence} socket={this.props.socket}></ExchangeInfluences>
        }
        if(this.state.blockChallengeRes != null) {
            isWaiting = false;
            blockChallengeDecision = <BlockChallengeDecision closeOtherVotes={this.closeOtherVotes} doneBlockChallengeVote={this.doneChallengeBlockingVote} name={this.props.name} prevAction={this.state.blockChallengeRes.prevAction} counterAction={this.state.blockChallengeRes.counterAction} socket={this.props.socket} ></BlockChallengeDecision>
        }
        if(this.state.blockingAction !== null) {
            isWaiting = false;
            blockDecision = <BlockDecision closeOtherVotes={this.closeOtherVotes} doneBlockVote={this.doneChallengeBlockingVote} name={this.props.name} action={this.state.blockingAction} socket={this.props.socket} ></BlockDecision>
        }
        if(this.state.playerIndex != null && !this.state.isDead) {
            influences = <>
            <p className=" flex items-center justify-center text-xl">Your Influences</p>
            <div className="flex flex-row">
                {this.state.players[this.state.playerIndex].influences.map((influence, index) => {
                    return  <div className=" flex flex-col justify-center items-center basis-1/2 mx-2 mb-2 text-xl" key={index}>
                                <span style={{backgroundColor: `${this.influenceColorMap[influence]}`}}></span>
                                <br></br>
                                <h3 className=" text-2xl">{influence}</h3>
                            </div>
                    })
                }
            </div>
            </>
            
            coins = <p>Coins: {this.state.players[this.state.playerIndex].money}</p>
        }
        if(isWaiting && !this.state.isDead) {
            waiting = <p>Waiting for other players...</p>
        }
        if(this.state.disconnected) {
            return (
                <div>
                    <p>You have been disconnected :c</p>
                    <p>Please recreate the game.</p>
                    <p>Sorry for the inconvenience (シ_ _)シ</p>
                </div>
            )
        }
        return (
            <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col item-centers justify-center font-bold bg-stone-300 text-black px-2 pt-2 rounded-md">
                {influences}
            </div>
            <PlayerBoard players={this.state.players}></PlayerBoard>
            {actionDecision}
            <div className=" flex flex-col items-center justify-center">
                {waiting}
                {revealDecision}
                {chooseInfluenceDecision}
                {exchangeInfluences}
                {challengeDecision}
                {blockChallengeDecision}
                {blockDecision}
                {pass}
                {playAgain}                
            </div>
            <b>{this.state.winner}</b>
            {this.state.playAgain}
            </div>
        )
    }
}
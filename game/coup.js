
import { Actions, CounterActions } from "./constants.js";
import { buildDeck,
        buildName_ID_Map,
        buildName_Socket_Map,
        buildPlayers,
        shuffleArray,
        exportPlayers} from "./utils.js";

export default class Coup {
    constructor(players, gameSocket) {
        this.nameSocketMap = buildName_Socket_Map(players);
        this.nameIndexMap = buildName_ID_Map(players);
        this.players = buildPlayers(players);
        this.gameSocket = gameSocket;
        this.currentPlayer = 0;
        this.deck = buildDeck();
        this.winner = '';
        this.actions = Actions;
        this.counterActions = CounterActions;
        this.isChallengeBlockOpen = false; //nghe challenge va block
        this.isRevealOpen = false; //nghe Reveal
        this.isChooseInfluenceOpen = false; //nghe hanh dong -1 influ khi action that bai
        this.isExchangeOpen = false; //ambassador action
        this.votes = 0;
    }

    //phuong thuc reset game
    resetGame(startingPlayer = 0) {
        this.currentPlayer = startingPlayer;
        this.isChallengeBlockOpen = false;
        this.isRevealOpen = false;
        this.isChooseInfluenceOpen = false;
        this.isExchangeOpen = false;
        this.aliveCount = this.players.length;
        this.votes = 0;
        this.deck = buildDeck();
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].money = 2;
            console.log(this.deck)
            this.players[i].influences = [this.deck.pop(), this.deck.pop()]
            this.players[i].isDead = false;
        }
    }

    listen() {
        //res
        //action 
        //source
        //target
        //amount
        this.players.map(x => {     
            // console.log("socketID: ", x.socketID, "socket: ", this.gameSocket.sockets.get(x.socketID));
            const socket = this.gameSocket.sockets.get(x.socketID);
            let bind = this

            socket.on('game-playAgain', () => {
                if (bind.isPlayAgainOpen) {
                    bind.isChallengeBlockOpen = false;
                    this.resetGame(Math.floor(Math.random() * (this.players.length)));
                    this.updatePlayers();
                    this.playTurn();
                }
            })

            socket.on('game-deductCoins', (res) => {
                console.log("Del " + res.amount + ' coins from ' + res.source)
                const sourceIndex = bind.nameIndexMap[res.source];
                bind.players[sourceIndex].money -= res.amount;
                bind.updatePlayers();
            })

            socket.on('game-actionDecision', (res) => {
                console.log("game-actionDecision: ", res)
                if (bind.actions[res.action.action].isChallengeable) { //neu co challenge duoc
                    bind.openChallenge(res.action, (bind.actions[res.action.action].blockableBy.length > 0))
                } else if (res.action.action == 'foreign_aid') {
                    bind.isChallengeBlockOpen = true;
                    bind.gameSocket.emit("game-openBlock", res.action);
                } else {
                    bind.applyAction(res.action);
                }
            })

            socket.on('game-challengeDecision', (res) => {
                console.log("game-challengeDecision: ", res);
                if (bind.isChallengeBlockOpen) {
                    if (res.isChallenging) {
                        bind.closeChallenge();
                        bind.gameSocket.emit("game-addLog", `${res.challenger} challenged ${res.challengee}`)
                        //TODO reveal
                        // reveal(action, counterAction, challengee, challenger, isBlock)
                        bind.reveal(res.action, null, res.challengee, res.challenger, false);
                    } else if (bind.votes + 1 == bind.aliveCount - 1) {
                        //then it is a pass
                        bind.closeChallenge();
                        bind.applyAction(res.action);
                    } else {
                        bind.votes += 1;
                    }
                }
            })

            socket.on('game-blockChallengeDecision', (res) => {
                console.log("game-blockChallengeDecision: ", res);
                // res.counterAction, res.prevAction, res.challengee, res.challenger, res.isChallenging
                if (bind.isChallengeBlockOpen) {
                    if (res.isChallenging) {
                        bind.closeChallenge();
                        bind.gameSocket.emit("game-addLog", `${res.challenger} challenged ${res.challengee}'s block`)
                        bind.reveal(res.prevAction, res.counterAction, res.challengee, res.challenger, true)
                    } else if (bind.votes + 1 == bind.aliveCount - 1) {
                        bind.closeChallenge();
                        bind.nextTurn();
                    } else {
                        bind.votes += 1;
                    }
                }
            })

            socket.on('game-blockDecision', (res) => {
                console.log("game-blockDecision: ", res)
                // res.prevAction.action, res.prevAction.target, res.prevAction.source, res.counterAction, res.blockee, res.blocker, res.isBlocking
                if (bind.isChallengeBlockOpen) {
                    if (res.isBlocking) {
                        bind.closeChallenge();
                        bind.gameSocket.emit("g-addLog", `${res.blocker} blocked ${res.blockee}`)
                        bind.openBlockChallenge(res.counterAction, res.blockee, res.prevAction);
                    } else if (bind.votes + 1 == bind.aliveCount - 1) {
                        //then it is a pass
                        bind.closeChallenge();
                        bind.applyAction(res.action);
                    } else {
                        bind.votes += 1;
                    }
                }
            })

            socket.on('game-revealDecision', (res) => {
                console.log("game-revrealDecision: ", res)
                console.log(res.isBlock)
                //Nếu có block, prevAction là hành động trước hành động Block
                //Nếu ko có block, prevAction là action
                // res.revealedCard, prevaction, counterAction, challengee, challenger, isBlock
                const challengeeIndex = bind.nameIndexMap[res.challengee];//nguoi bi challenge
                const challengerIndex = bind.nameIndexMap[res.challenger];//nguoi challenge
                if (bind.isRevealOpen) {
                    bind.isRevealOpen = false;
                    if (res.isBlock) { //block challenge (for example, a captain (challengee) blocking a steal or a contessa (challengee) blocking an assasinate)
                        if (
                            res.revealedCard == res.counterAction.claim ||
                            (res.counterAction.counterAction == 'block_steal' &&
                                (res.revealedCard == 'ambassador' || res.revealedCard == 'captain'))
                        ) { //challenge failed: Người challenge cái action block của người bị challenge bị failed 
                            bind.gameSocket.emit("game-addLog", `${res.challenger}'s challenge on ${res.challengee}'s block failed`)
                            for (let i = 0; i < bind.players[challengeeIndex].influences.length; i++) { //replace revealed card with another
                                if (bind.players[challengeeIndex].influences[i] == res.revealedCard) {
                                    bind.deck.push(bind.players[challengeeIndex].influences[i]);
                                    bind.deck = shuffleArray(bind.deck);
                                    bind.players[challengeeIndex].influences.splice(i, 1);
                                    bind.players[challengeeIndex].influences.push(bind.deck.pop());
                                    break;
                                }
                            }
                            bind.updatePlayers();
                            bind.isChooseInfluenceOpen = true;
                            bind.gameSocket.to(bind.nameSocketMap[res.challenger]).emit('game-chooseInfluence'); //emit to challenger (failed challenge)
                            bind.nextTurn();
                        } else { //challenge succeeded: Người challenge cái action block của người bị challenge thành công
                            bind.gameSocket.emit("game-addLog", `${res.challenger}'s challenge on ${res.challengee}'s block succeeded`)
                            bind.gameSocket.emit("game-addLog", `${res.challengee} lost their ${res.revealedCard}`)
                            for (let i = 0; i < bind.players[challengeeIndex].influences.length; i++) {
                                if (bind.players[challengeeIndex].influences[i] == res.revealedCard) { //xóa revealcard của người bị challenge action block
                                    bind.deck.push(bind.players[challengeeIndex].influences[i]);
                                    bind.deck = shuffleArray(bind.deck);
                                    bind.players[challengeeIndex].influences.splice(i, 1);
                                    break;
                                }
                            }
                            console.log(res.prevAction)
                            bind.applyAction(res.prevAction);
                        }
                    } else { //normal challenge: không có hành động challenge block
                        if (res.revealedCard == bind.actions[res.prevAction.action].influence) { // challenge failed: người bị challenge chứng minh đc
                            console.log("CHALLENGE: " + res.revealedCard + " " + bind.actions[res.prevAction.action].influence);
                            bind.gameSocket.emit("game-addLog", `${res.challenger}'s challenge on ${res.challengee} failed`)
                            for (let i = 0; i < bind.players[challengeeIndex].influences.length; i++) { //revealed card needs to be replaced
                                if (bind.players[challengeeIndex].influences[i] == res.revealedCard) {
                                    bind.deck.push(bind.players[challengeeIndex].influences[i]);
                                    bind.deck = shuffleArray(bind.deck);
                                    bind.players[challengeeIndex].influences.splice(i, 1);
                                    bind.players[challengeeIndex].influences.push(bind.deck.pop());
                                    break;
                                }
                            }

                            //Nếu lá của người bị Challenge Action là Assasin, tiến hành 
                            if (res.revealedCard == 'assassin' && res.prevAction.target == res.challenger
                                && bind.players[challengerIndex].influences.length == 2) {
                                bind.deck.push(bind.players[challengeeIndex].influences[0]);
                                bind.deck = shuffleArray(bind.deck);
                                bind.players[challengerIndex].influences.splice(0, 1);
                            }

                            bind.updatePlayers();
                            bind.isChooseInfluenceOpen = true;
                            bind.gameSocket.to(bind.nameSocketMap[res.challenger]).emit('game-chooseInfluence');
                            bind.applyAction(res.prevAction);
                        } else { // challenge succeeded
                            bind.gameSocket.emit("game-addLog", `${res.challenger}'s challenge on ${res.challengee} succeeded`)
                            bind.gameSocket.emit("game-addLog", `${res.challengee} lost their ${res.revealedCard}`)
                            for (let i = 0; i < bind.players[challengeeIndex].influences.length; i++) { // 
                                if (bind.players[challengeeIndex].influences[i] == res.revealedCard) {
                                    bind.deck.push(bind.players[challengeeIndex].influences[i]);
                                    bind.deck = shuffleArray(bind.deck);
                                    bind.players[challengeeIndex].influences.splice(i, 1);
                                    break;
                                }
                            }
                            bind.nextTurn();
                        }
                    }
                }
            })

            socket.on('game-chooseInfluenceDecision', (res) => {
                console.log("game-chooseInfluenceDecision", res);
                //res.influence, res.playerName
                const playerIndex = bind.nameIndexMap[res.playerName];
                if (bind.isChooseInfluenceOpen) {
                    bind.gameSocket.emit("game-addLog", `${res.playerName} lost their ${res.influence}`)
                    for (let i = 0; i < bind.players[playerIndex].influences.length; i++) {
                        if (bind.players[playerIndex].influences[i] == res.influence) {
                            bind.deck.push(bind.players[playerIndex].influences[i]);
                            bind.deck = shuffleArray(bind.deck);
                            bind.players[playerIndex].influences.splice(i, 1);
                            break;
                        }
                    }
                    bind.isChooseInfluenceOpen = false;
                    bind.nextTurn();
                }
            })

            socket.on('game-chooseExchangeDecision', (res) => {
                console.log("game-chooseExchangeDecision", res);
                //res.playerName, res.kept (influence giu lai), res.putBack = ["influence, influence"] (influence bo di)
                const playerIndex = bind.nameIndexMap[res.playerName];
                if (bind.isExchangeOpen) {
                    bind.players[playerIndex].influences = res.kept;
                    bind.deck.push(res.putBack[0]);
                    bind.deck.push(res.putBack[1]);
                    bind.deck = shuffleArray(bind.deck);
                    bind.isExchangeOpen = false;
                    bind.nextTurn();
                }
            })
        })
    }

    updatePlayers() {
        console.log("Test Exchangeeeeeeeeeeeeeeee: ", this.players);
        console.log("JSON: ", JSON.parse(JSON.stringify(this.players)));
        this.gameSocket.emit("game-updatePlayers", exportPlayers(JSON.parse(JSON.stringify(this.players))));
    }


    //lat bai
    reveal(action, counterAction, challengee, challenger, isBlock) {
        //isBlock == true, action kem theo prevAction
        //isBlock == false, counterAction == null va action la hanh dong dang bi thu thach
        const res = {
            action: action,
            counterAction: counterAction,
            challengee: challengee,
            challenger: challenger,
            isBlock: isBlock
        }
        console.log(258, res)
        console.log(this.nameSocketMap)
        console.log(challengee)
        this.isRevealOpen = true;
        this.gameSocket.to(this.nameSocketMap[res.challengee]).emit("game-chooseReveal", res);
    }


    //đóng challenge

    closeChallenge() {
        this.isChallengeBlockOpen = false;
        this.votes = 0;
        //đóng block, challenge, blockChallenge action
        this.gameSocket.emit('game-closeChallenge');
        this.gameSocket.emit('game-closeBlock')
        this.gameSocket.emit('game-closeBlockChallenge')
    }

    //mở Challenge

    openChallenge(action, isBlockable) {
        console.log("Open Challenge: ", action);
        this.isChallengeBlockOpen = true;
        if (isBlockable && action.target != null) {
            let targetIndex = 0;
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].name == action.target) {
                    targetIndex = i;
                    break;
                }
            }
            console.log(this.players[targetIndex].socketID)
            this.gameSocket.to(this.players[targetIndex].socketID).emit("game-openBlock", action)
        }
        this.gameSocket.emit("game-openChallenge", action);
    }

    //

    openBlockChallenge(counterAction, blockee, prevAction) {
        this.isChallengeBlockOpen = true;
        this.gameSocket.emit("game-openBlockChallenge", {
            counterAction: counterAction,
            prevAction: prevAction
        });
    }

    /// apply action after all logic game
    applyAction(action) {
        console.log(action);
        let log = '';

        if (action.target) {
            log = `on ${action.target}`;
        }

        this.gameSocket.emit("game-addLog", `${action.soure} used ${action.action}${log}`)

        const execute = action.action; //action
        const target = action.target; //nguoi chiu action
        const source = action.source; //nguoi action

        if (execute == 'income') {
            for (let i = 0; i < this.players.length; i++) {
                if (source == this.players[i].name) {
                    this.players[i].money += 1;
                    break;
                }
            }
            this.nextTurn();
        } else if (execute == 'foreign_aid') {
            for (let i = 0; i < this.players.length; i++) {
                if (source == this.players[i].name) {
                    this.players[i].money += 2;
                    break;
                }
            }
            this.nextTurn();
        } else if (execute == 'coup') {
            for (let i = 0; i < this.players.length; i++) {
                if (target == this.players[i].name) {
                    this.isChooseInfluenceOpen = true;
                    this.gameSocket.to(this.nameSocketMap[target]).emit('game-chooseInfluence');
                    break;
                }
            }
            this.nextTurn();
        } else if (execute == 'tax') {
            for (let i = 0; i < this.players.length; i++) {
                if (source == this.players[i].name) {
                    this.players[i].money += 3;
                    break;
                }
            }
            this.nextTurn();
        } else if (execute == 'assassinate') {
            for (let i = 0; i < this.players.length; i++) {
                if (target == this.players[i].name) {
                    this.isChooseInfluenceOpen = true;
                    this.gameSocket.to(this.nameSocketMap[target]).emit('game-chooseInfluence')
                    break;
                }
            }
            this.nextTurn();
        } else if (execute == 'steal') {
            let stolen = 0;
            for (let i = 0; i < this.players.length; i++) {
                if (target == this.players[i].name) {
                    if (this.players[i].money >= 2) {
                        this.players[i].money-=2;
                        stolen = 2;
                    } else if (this.players[i].money == 1) {
                        this.players[i].money-=1;
                        stolen = 1;
                    } else {
                        //cant stolen
                    }
                }
            }

            for (let i = 0; i < this.players.length; i++) {
                if (source == this.players[i].name) {
                    this.players[i].money += stolen
                    break;
                }
            }
            this.nextTurn();
        } else if (execute == 'exchange') {
            const drawTwo = [this.deck.pop(), this.deck.pop()];
            this.isExchangeOpen = true;
            let targetIndex = 0;
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].name == action.source) {
                    targetIndex = i;
                    break;
                }
            }
            console.log("execute == exchange log: ");
            console.log(drawTwo);
            console.log(this.players[targetIndex]);
            console.log([...this.players[targetIndex].influences, ...drawTwo]);
            const list = [...this.players[targetIndex].influences, ...drawTwo];
            console.log(list);
            this.gameSocket.to(this.nameSocketMap[source]).emit('game-openExchange', (list));

            //next Turn after chooseExchangeDecision
        } else {
            console.log("ACTION NOT FOUND!!!");
        }
    }
    ///
    nextTurn() {
        console.log(!this.isChallengeBlockOpen, !this.isChooseInfluenceOpen, !this.isExchangeOpen, !this.isRevealOpen)
        //check ko hanh dong nao dang mo
        if (!this.isChallengeBlockOpen && !this.isChooseInfluenceOpen && !this.isExchangeOpen && !this.isRevealOpen) {
            this.players.forEach(x => {
                console.log(x.influences)
                if (x.influences.length == 0 && !x.isDead) {// player is dead
                    this.gameSocket.emit("game-addLog", `${x.name} is out!`)
                    this.aliveCount -= 1;
                    x.isDead = true;
                    x.money = 0;
                }
            });
        
        this.updatePlayers();
        //kiem tra so nguoi song
        if (this.aliveCount == 1) {
            let winner = null
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].influences.length > 0) {
                    winner = this.players[i].name;
                }
            }
            this.isPlayAgainOpen = true;
            this.gameSocket.emit("game-gameOver", winner);
            //END
        } else {
            //next Turn
            do {
                this.currentPlayer += 1;
                this.currentPlayer %= this.players.length;
            } while (this.players[this.currentPlayer].isDead == true);
            this.playTurn();
        }
    }
    }

    playTurn() {
        //move to next turn of next player
        this.gameSocket.emit("game-updateCurrentPlayer", this.players[this.currentPlayer].name);
        console.log(this.players[this.currentPlayer].socketID)
        //menu choose action
        this.gameSocket.to(this.players[this.currentPlayer].socketID).emit('game-chooseAction');
    }

    onChooseAction(action) {
        console.log('action', action)
    }

    start() {
        this.resetGame();
        this.listen();
        this.updatePlayers();
        console.log("Game started");
        this.playTurn();
    }
}

// module.exports = Coup;
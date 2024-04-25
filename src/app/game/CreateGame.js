import React, { Component } from 'react';
import { io } from 'socket.io-client';
import { ReactSortable } from 'react-sortablejs';
import Coup from './Coup';
import axios from 'axios';
export default class CreateGame extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            roomCode: '',
            copied: false,
            isInRoom: false,
            isLoading: false,
            players: [],
            isError: false,
            isGameStarted: false,
            errorMsg: '',
            canStart: false,
            socket: null,
        }
    }
    onNameChange = (name) => {
        this.setState({ name });
    }

    joinParty = async () => {
        try {
            console.log(this.state.roomCode);
            const socket = await io(`http://localhost:8080/${this.state.roomCode}`);
            await this.setStateAsync({ socket: socket });
            console.log("socket created");
            console.log(this.state.name);
            socket.emit('setName', this.state.name);

            socket.on("joinSuccess", () => {
                console.log("join successful");
                this.setStateAsync({
                    isLoading: false,
                    isInRoom: true
                });
            });

            socket.on("joinFailed", (err) => {
                console.log("join failed, cause: " + err);
                this.setStateAsync({ isLoading: false });
            });

            socket.on("leader", () => {
                console.log("You are the leader");
            });

            socket.on('partyUpdate', (players) => {
                console.log(players);
                this.setStateAsync({ players });
                const allReady = players.length >= 2 && players.every(player => player.isReady);
                this.setStateAsync({ canStart: allReady });
            });

            socket.on('disconnected', () => {
                console.log("You've lost connection with the server");
            });
        } catch (error) {
            console.error("Error in joinParty method", error);
        }
    }

    // Helper function to use setState with async/await
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve);
        });
    }

    createParty = () => {
        if (this.state.name === '') {
            //TODO  handle error
            console.log('Please enter a name');
            this.setState({ errorMsg: 'Please enter a name' });
            this.setState({ isError: true });
            return
        }

        this.setState({ isLoading: true });
        console.log(this.state.isLoading)
        const bind = this;
        axios.get('http://localhost:8080/createNamespace')
            .then((res) => {
                console.log(res);
                // console.log(res.data.namespaces)
                this.setState({
                    roomCode: res.data.namespaces,
                    errorMsg: ''
                }, () => {
                    // console.log(this.state.roomCode);
                    this.joinParty();
                });
            })
            .catch((err) => {
                console.error("error in creating namespace", err);
                this.setState({
                    isLoading: false,
                    errorMsg: 'Error creating room, server is unreachable',
                    isError: true
                });
            });

    }
    startGame = () => {
        this.state.socket.emit('startGameSignal', this.state.players)

        this.state.socket.on('startGame', () => {
            this.setState({ isGameStarted: true });
        })
    }
    render() {
        if (this.state.isGameStarted) {
            return (<Coup name={this.state.name} socket={this.state.socket}></Coup>)
        }
        let error = null;
        let roomCode = null;
        let startGame = null;
        let createButton = null;
        let youCanSort = null;
        if (!this.state.isInRoom) {
            createButton = <>
                <button onClick={this.createParty} disabled={this.state.isLoading}>{this.state.isLoading ? 'Creating...' : 'Create'}</button>
                <br></br>
            </>
        }
        if (this.state.isError) {
            error = <b>{this.state.errorMsg}</b>
        }
        if (this.state.roomCode !== '' && !this.state.isLoading) {
            youCanSort = <p>You can drag to re-arrange the players in a specific turn order!</p>
            roomCode = <div className='m-2 items-center'>
                <p className='flex flex-col items-center rounded-sm border-solid border-2 border-[#0F1B38] bg-[#514846]'>ROOM CODE: <br></br> <br></br>
                    <b className="text-black bg-[#F2F2F2] cursor-pointer m-[5px] p-[5px] rounded-[5px] border-2 border-solid border-[#707070]" onClick={this.copyCode}>{this.state.roomCode}
                        <span className="iconify" data-icon="typcn-clipboard" data-inline="true"></span>
                    </b>
                </p>
                {this.state.copied ? <p>Copied to clipboard</p> : null}
            </div>
        }
        if (this.state.canStart) {
            startGame = <button onClick={this.startGame}>Start Game</button>
        }
        return (
            <div className='absolute flex flex-col'>
                <p>Please enter your name</p>
                <input className=' text-black'
                    type="text" value={this.state.name} disabled={this.state.isLoading || this.state.isInRoom}
                    onChange={e => {
                        if (e.target.value.length <= 10) {
                            this.setState({
                                errorMsg: '',
                                isError: false
                            })
                            this.onNameChange(e.target.value);
                        } else {
                            this.setState({
                                errorMsg: 'Name must be less than 11 characters',
                                isError: true
                            })
                        }

                    }}
                />
                <br></br>
                {createButton}
                {error}
                <br></br>
                {roomCode}
                <div className='text-center mx-auto my-0'>
                    <ReactSortable list={this.state.players} setList={newState => this.setState({ players: newState })}>
                        {this.state.players.map((item, index) => {
                            let ready = null
                            let readyUnitColor = '#E46258'
                            if (item.isReady) {
                                ready = <b>Ready!</b>
                                readyUnitColor = '#73C373'
                            } else {
                                ready = <b>Not Ready</b>
                            }
                            return (
                                <div style={{ backgroundColor: readyUnitColor }} key={index}>
                                    <p >{index + 1}. {item.name} {ready}</p>
                                </div>
                            )
                        })
                        }
                    </ReactSortable>
                </div>

                {startGame}
            </div>
        )
    }
}
import React, { Component } from 'react'
import io from "socket.io-client";
import Coup from './Coup';
import axios from 'axios';
export default class JoinGame extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            roomCode: '',
            players: [],
            isInRoom: false,
            isReady: false,
            isLoading: false,
            isError: false,
            isGameStarted: false,
            errorMsg: '',
            socket: null,
            nameIsSet: false
        }
    }
    onNameChange = (name) => {
        this.setState({name});
    }
    onCodeChange = (roomCode) => {
        this.setState({roomCode});
    }
    joinParty = () => {
        const bind = this;
        const socket = io(`http://localhost:8080/${this.state.roomCode}`);
        this.setState({socket});
        console.log("socket created");
        socket.emit('setName', this.state.name);
        socket.on('joinSuccess', function() {
            console.log('join successful')
            bind.setState({isInRoom: true, nameIsSet: true})
        });
        socket.on('joinFailed', function(err) {
            console.log('join failed, cause: ' + err);
            bind.setState({
                errorMsg: err,
                isError: true,
                isLoading: false,
            });
            socket.disconnect();
        });
        socket.on('startGame', () => {
            this.setState({ isGameStarted: true});
        });
        socket.on('partyUpdate', (players) => {
            console.log(players);
            this.setState({ players})
            if(players.length >= 3 && players.map(x => x.isReady).filter(x => x === true).length === players.length) {
                this.setState({ canStart: true});
            } else {
                this.setState({ canStart: false});
            }
        });
        socket.on('disconnected', function() {
            console.log("You've lost connection with the server");
        })
    }
    attemptJoinParty = () => {
        if(this.state.name ==='') {
            console.log("Please enter a name");
            this.setState({
                errorMsg: "Please enter a name",
                isError: true
            });
            return
        }
        if(this.state.roomCode === '') {
            console.log("Please enter a room code");
            this.setState({
                errorMsg: "Please enter a room code",
                isError: true
            });
            return
        };
        this.setState({ isLoading: true});
        const bind = this
        axios.get(`http://localhost:8080/exists/${this.state.roomCode}`)
            .then((res) => {
                console.log(res)
                if(res.data.exists) {
                    console.log("joining");
                    bind.setState({ errorMsg: ''});
                    bind.joinParty();

                } else {
                    console.log(" Invalid Party Code")
                    bind.setState({
                        isLoading: false,
                        errorMsg: "Invalid Party Code",
                        isError: true
                    });
                }
            })
            .catch(function (err) {
                console.log("error in getting exists", err);
                bind.setState({ 
                    isLoading: false,
                    errorMsg: 'Server error',
                    isError: true
                });
            });
    }
    reportReady = () => {
        this.state.socket.emit('setReady', true);
        this.state.socket.on('readyConfirm', () => {
            this.setState({ isReady: true})
        })
    }
    render() {
        if(this.state.isGameStarted) {
            return (<Coup name={this.state.name} socket={this.state.socket}></Coup>);
        }
        let error = null;
        let joinReady = null;
        let nameInputUI = null;
        let board = null;
        let ready = null;
        if(this.state.isError) {
            error = <b>{this.state.errorMsg}</b>
        };
        if(this.state.isInRoom) {
            joinReady = <button className="joinButton" onClick={this.reportReady} disabled={this.state.isReady}>Ready</button>
        } else {
            joinReady = <button className=" bg-white text-black my-2 px-2 rounded-md hover:bg-green-400 " onClick={this.attemptJoinParty} disabled={this.state.isLoading}>{this.state.isLoading ? 'Joining...': 'Join Room'}</button>
        };
        if(this.state.isReady) {
            ready = <b style={{ color: '#5FC15F' }}>You are ready!</b>
            joinReady = null
        };
        if(!this.state.nameIsSet) {
            nameInputUI = <div className=' flex items-center justify-center flex-col bg-slate-800 min-h-fit w-1/2 rounded-md'>
                <p>Please enter your name</p>
                <input className=' text-black my-2 rounded-sm pl-2'
                    type="text" value={this.state.name} disabled={this.state.isLoading || this.state.isInRoom}
                    onChange={e => {
                        if(e.target.value.length <= 10){
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
                <p>Room Code</p>
                <input
                    type="text" className=' text-black rounded-sm pl-2' value={this.state.roomCode} disabled={this.state.isLoading}
                    onChange={e => this.onCodeChange(e.target.value)}
                />
                {joinReady}
                {error}
            </div>

        } else {
            board = 
            // <div className=" min-h-screen flex items-center justify-center w-full">
                <div className=" text-cyan-200 font-bold text-xl relative flex flex-col py-2 items-center justify-start min-h-96 h-fit w-full bg-slate-800 rounded-md">
                    <div>
                        ROOM ID: {this.state.roomCode}
                    </div>
                    <div className="flex flex-row w-full">
                        <div className=" flex justify-center basis-1/2">Participant Name</div>
                        <div className=" flex justify-center basis-1/2 ">State</div>
                    </div>

                    {this.state.players.map((item,index) => {
                    return (
                        <div className="flex flex-row w-full mt-2" key={index}>
                            <div className=" flex justify-center basis-1/2 ">{item.name}</div>
                            <div className=" flex justify-center basis-1/2 ">
                                {
                                    item.isReady
                                    ? <p className=' bg-green-400 px-2 rounded-md'>Ready!</p>
                                    : <p className=' bg-red-400 px-2 rounded-md'>Not Ready</p>
                                }
                            </div>
                        </div>
                    )
                    })
                }
                    <div className="absolute bottom-0 mb-2 px-2 rounded-lg text-2xl  bg-green-500">
                        {joinReady}
                    </div>
                </div>
        }
        return (
            <div className=' flex items-center justify-center w-1/2 '>
                {nameInputUI}
                {board}
            </div>
        )
    }
}
import React, { Component } from 'react';
import { io } from 'socket.io-client';
import { ReactSortable } from 'react-sortablejs';
import Coup from './Coup';
import axios from 'axios';
let username = localStorage.getItem("username");
let nameEmit = ""
let getID = localStorage.getItem("idSkin")
if(getID != null) {
    nameEmit = username +"-"+ getID
}
export default class CreateGame extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: username != null ? username + "-"+getID : "",
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
            nameIsSet:  false,
        }
    }
    onNameChange = (name) => {
        this.setState({ name });

    }
    
    joinParty = () => {
        const bind = this
        console.log("roomCode: ", this.state.roomCode)
        console.log("Loading: ", this.state.isLoading)
        const socket = io(`http://localhost:8080/${this.state.roomCode}`);
        
        this.setState({ socket });
        console.log("socket created");
        console.log(this.state.name);
        
        socket.emit('setName', this.state.name);
        // console.log("setName Done")

        socket.on("joinSuccess", function() {
            console.log("join successful")
            bind.setState({ 
                isLoading: false,
                isInRoom: true,
                nameIsSet: true,
            });
        })

        socket.on("joinFailed", function(err) {
            console.log("join failed, cause: " + err);
            bind.setState({ isLoading: false });
        })

        socket.on("leader", function() {
            console.log("You are the leader")
        })

        socket.on('partyUpdate', (players) => {
            console.log(players)
            this.setState({ players })
            if(players.length >= 2 && players.map(x => x.isReady).filter(x => x === true).length === players.length) { //TODO CHANGE 2 BACK TO 3
                this.setState({ canStart: true })
            } else {
                this.setState({ canStart: false })
            }
        })

        socket.on('disconnected', function() {
            console.log("You've lost connection with the server")
        });
    }
    createParty = () => {
        if(this.state.name === '') {
            //TODO  handle error
            console.log('Please enter a name');
            this.setState({ errorMsg: 'Please enter a name' });
            this.setState({ isError: true });
            return
        }

        this.setState({ isLoading: true });
        
        const bind = this;
        axios.get(`http://localhost:8080/createNamespace`)
            .then((res) => {
                console.log(res);
                console.log(res.data.namespace);
                    bind.setState({ roomCode: res.data.namespace, errorMsg: '' 
                }, () => {
                    console.log(this.state.roomCode);
                    this.joinParty();
                });



            })
            .catch(function (err) {
                //TODO  handle error
                console.log("error in creating namespace", err);
                bind.setState({ isLoading: false });
                bind.setState({ errorMsg: 'Error creating room, server is unreachable' });
                bind.setState({ isError: true });
            })
    }
    startGame = () => {
        this.state.socket.emit('startGameSignal', this.state.players)

        this.state.socket.on('startGame', () => {
            this.setState({ isGameStarted: true});
        })
    }
    render() {
        if(this.state.isGameStarted) {
            return (
                <Coup name={this.state.name} socket={this.state.socket}></Coup>
            )
        }
        let error = null;
        let roomCode = null;
        let startGame = null;
        let createButton = null;
        let nameInputUI = null;
        let youCanSort = null;
        let board = null;

        if(!this.state.isInRoom) {
            createButton = <>
            <button className='bg-white text-black my-2 px-2 rounded-md hover:bg-green-400' onClick={this.createParty} disabled={this.state.isLoading}>{this.state.isLoading ? 'Creating...': 'Create Room'}</button>
            </>
        }
        if(this.state.isError) {
            error = <b>{this.state.errorMsg}</b>
        }
        if(this.state.canStart) {
            startGame = <button onClick={this.startGame}>Start Game</button>
        }
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
                {createButton}
                {error}
            </div>

        }else {
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
                                            : <p className=' bg-red-400 rounded-md'>Not Ready</p>
                                        }
                                    </div>
                                </div>
                            )
                            })
                        }
                            <div className="absolute bottom-0 mb-2 px-2 rounded-lg text-2xl  bg-green-500">
                                {startGame}
                            </div>
                        </div>
                    // </div>
        }
        return (
            <div className=' flex items-center justify-center w-1/2 '>
                { nameInputUI }
                {board}
            </div>
        )
    }
}
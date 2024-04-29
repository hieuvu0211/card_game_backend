import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import mysql from "mysql2";
import {
  GetAllPlayers,
  Register,
  Login,
  UpdatePassword,
} from "./controllers/playerController.js";

import {
  getAllskins,
  addNewSkin,
  updateSkin,
  deleteSkin,
} from "./controllers/skinController.js";
import {
  addNewSkinGroup,
  deleteSkinGroup,
  getAllSkinGroups,
  updateSkinGroup,
} from "./controllers/skinGroupController.js";
import {
  addNewSkinUser,
  deleteSkinUserByPlayerId,
  deleteSkinUserBySkinId,
  deleteSkinUserBySkinUserId,
  updateSkinUser,
} from "./controllers/skinUserController.js";
import {
  createNewMatch,
  getAllMatches,
  updateMatchById,
  getMatchById,
  deleteMatchById,
} from "./controllers/mathController.js";
import {
  deleteMatchParticipantById,
  getAllMatchParticipants,
  updateMatchParticipantById,
  getMatchParticipantById,
  createNewMatchParticipant,
} from "./controllers/match_participantController.js";
import {
  createNewDeposit,
  deleteDepositById,
  getAllDeposits,
  getDepositById,
  updateDepositById,
} from "./controllers/depositController.js";

import Coup from "./game/coup.js"

const app = express();
const server = createServer(app);
app.use(cors());
app.use(express.json());

//socket io connection to client side
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "http://localhost:3000",
  },
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "long9203",
  database: "CardGame",
});

// connect to database
db.connect((err) => {
  if (err) {
    // stack;
    // console.log(`error connecting ${err.stack}`);
    return;
  }
  console.log(`database connection established`);
});
global.db = db; //db are available globally

// let ListRoom = [];
// let index = 0;
// io.on("connection", (socket) => {
//   socket.on("load", () => {
//     console.log("ok loaded");
//     io.emit("lRooms", ListRoom);
//   });
//   socket.on("join", (roomid) => {
//     console.log("joined with id", roomid);
//     socket.join(roomid);
//     for (let i = 0; i < index; i++) {
//       console.log(ListRoom[i]);
//     }
//     let check = false;
//     ListRoom.forEach((e) => {
//       if (e == roomid) {
//         check = true;
//       }
//     });
//     if (!check) {
//       ListRoom[index] = roomid;
//       ++index;
//     }
//     io.emit("lRooms", ListRoom);
//   });
//   socket.on("chat", (roomid, message) => {
//     console.log(`${roomid} and ${message}`);
//     socket.join(roomid);
//     io.to(roomid).emit("chat", message);
//     //io.emit("chat", "CHAT");
//   });
//   let dis = 1;
//   socket.on("disconnect", () => {
//     console.log("user disconnected", ++dis);
//   });
// });

///////########## Game Room ##########
//----------------------------------------------------------------------------------------------
let namespaces = {};
app.get("/createNamespace", function (req, res) { //create ROOM

  let newNamespace = "";
  while (newNamespace === "" || newNamespace in namespaces) {
    //gen random seed
    const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    newNamespace = result;
  }
  openSocket(`/${newNamespace}`);
  console.log("openSocket:", openSocket)
  namespaces[newNamespace] = null;
  console.log(newNamespace + " CREATED")
  res.json({ namespace: newNamespace })
});

app.get("/exists/:namespace", function (req, res) { //get exist ROOM
  const namespace = req.params.namespace;
  res.json({ exists: (namespace in namespaces) });
})

/////// mainSocket for room
const openSocket = (namespace) => {
  console.log('namespace: ', namespace)
  const gameSocket = io.of(namespace);
  console.log("run through")
  let players = []; //players in line
  let partyMembers = []; //players in room
  let partyLeader = "";
  let started = false; //game Status
  //connection to room

  gameSocket.on("connection", (socket) => {
    console.log("id: ", socket.id);
    players.push({ //add player
      "player": '',
      "socket_id": `${socket.id}`,
      "isReady": false
    })
    console.log(`Player ${players.length} has connected`)
    socket.join(socket.id);
    console.log('socket joined ' + socket.id);
    const index = players.length - 1;

    //party list update
    const updatePartyList = () => {
      partyMembers = players.map(x => {
        return { name: x.player, socketID: x.socket_id, isReady: x.isReady }
      }).filter(x => x.name != '')
      console.log(partyMembers);
      //send
      gameSocket.emit('partyUpdate', partyMembers);
    }

    socket.on('setName', (name) => { //set player name when join
      console.log("go setName")
      console.log(started)

      if (started) {//if game started
        gameSocket.to(players[index].socket_id).emit("joinFailed", 'game_already_started');
        return
      }

      if (!players.map(x => x.player).includes(name)) { //kiem tra ten co ton tai hay chua
        if (partyMembers.length >= 6) {
          gameSocket.to(players[index].socket_id).emit("joinFailed", 'party_full')
          console.log(">6")
        } else {
          if (partyMembers.length == 0) {
            partyLeader = players[index].socket_id;
            players[index].isReady = true;
            gameSocket.to(players[index].socket_id).emit("leader");
            console.log("PARTY LEADER IS " + partyLeader)
          }
          players[index].player = name;
          // console.log(players[index]);
          updatePartyList();
          gameSocket.to(players[index].socket_id).emit("joinSuccess", players[index].socket_id);
        }
      } else {
        gameSocket.to(players[index].socket_id).emit("joinFailed", 'name_taken')
        console.log("error")
      }
    })

    socket.on('setReady', (isReady) => { //user ready
      console.log(`${players[index].player} is ready`);
      players[index].isReady = isReady;
      updatePartyList();
      gameSocket.to(players[index].socket_id).emit("readyConfirm")
    })

    socket.on("startGameSignal", (players) => { //start signal
      started = true;
      gameSocket.emit("startGame");
      startGame(players, gameSocket, namespace);
    })

    socket.on("disconnect", () => { //disconnect 
      console.log('disconnected ' + socket.id);
      players.map((x, index) => {
        if (x.socket_id == socket.id) {
          gameSocket.emit('game-addLog', `${JSON.stringify(players[index].player)} has disconnected`);
          gameSocket.emit('game-addLog', 'Please recreate the game');
          gameSocket.emit('game-addLog', 'Sorry for the inconvenience');
          players[index].player = '';
          if (socket.id === partyLeader) {
            console.log("Leader disconnected");
            gameSocket.emit('leaderDisconnect', "leader_disconnect");
            socket.removeAllListeners();
            // if (io.nsps[`${namespace}`]) {
            //   delete io.nsps[`${namespace}`];
            // }
            delete namespaces[namespace.substring(1)]
            players = [];
            partyMembers = []
          }
        }
      });

      //check socket connect
      console.log(Object.keys(gameSocket['sockets']).length)
      updatePartyList();
    })
  });


  // let checkEmptyInterval = setInterval(() => {
  //   console.log(Object.keys(namespaces))
  //   if (Object.keys(gameSocket['sockets']).length == 0) {
  //     delete io.nsps[namespace];
  //     if (namespaces[namespace] != null) {
  //       delete namespaces[namespace.substring(1)]
  //     }
  //     clearInterval(checkEmptyInterval)
  //     console.log(namespace
  //       + 'deleted')
  //   }
  // }, 10000)
}

const startGame = (players, gameSocket, namespace) => {
  namespaces[namespace.substring(1)] = new Coup(players, gameSocket);
  namespaces[namespace.substring(1)].start();
}


//--------------------------------------END_GAME-------------------------------------------------




//----------------------------------------------------------------------------------------------
//get all user
app.get("/getallusers", GetAllPlayers);
//user register
app.post("/register", Register);
//user login
app.post("/login", Login);
//user update password
app.put("/userupdate/:id", UpdatePassword);

//----------------------------------------------------------------------------------------------
//get all group skin
app.get("/getallskingroups", getAllSkinGroups);
//create new skin group
app.post("/addnewskingroup", addNewSkinGroup);
//update name skin group
app.put("/updateskingroup/:id", updateSkinGroup);
//delete skin group
app.delete("/deleteskingroup/:id", deleteSkinGroup);
//----------------------------------------------------------------------------------------------
//get all skin
app.get("/getallskins", getAllskins);
//add new skin
app.post("/addnewskin", addNewSkin);
// update a skin
app.put("/updateskin/:id", updateSkin);
//delete a skin
app.delete("/deleteskin/:id", deleteSkin);
//----------------------------------------------------------------------------------------------
//add new skin_user
app.post("/addnewskinuser", addNewSkinUser);
//update skin_user
app.put("/updateskinuser/:id", updateSkinUser);
//delete skin_user row
app.delete("/deleteskinuserbyskinuser/:id", deleteSkinUserBySkinUserId);
app.delete("/deleteskinuserbyuser/:id", deleteSkinUserByPlayerId);
app.delete("/deleteskinuserbyskin/:id", deleteSkinUserBySkinId);

//----------------------------------------------------------------------------------------------
//Matches
app.get("/getallmatches", getAllMatches);
app.get("/getmatchbyid/:id", getMatchById);
app.post("/addnewmatch", createNewMatch);
app.put("/updatematch/:id", updateMatchById);
app.delete("/deletematch/:id", deleteMatchById);

//----------------------------------------------------------------------------------------------

//Match Participants
app.get("/getallmatchparticipants", getAllMatchParticipants);
app.get("/getmatchparticipantbyid/:id", getMatchParticipantById);
app.post("/addnewmatchparticipant", createNewMatchParticipant);
app.put("/updatematchparticipant/:id", updateMatchParticipantById);
app.delete("/deletematchparticipant/:id", deleteMatchParticipantById);

//----------------------------------------------------------------------------------------------
//Deposit History
app.get("/getalldeposithistory", getAllDeposits);
app.post("/addnewdeposit", createNewDeposit);
app.get("/getalldeposithistory", getDepositById);
app.put("/updatedeposit/:id", updateDepositById);
app.delete("/deleteposithistory", deleteDepositById);
//----------------------------------------------------------------------------------------------

server.listen(8080, () => {
  console.log("server running at http://localhost:8080");
});

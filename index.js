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
  password: "021103",
  database: "CardGame",
});

//connect to database
db.connect((err) => {
  if (err) {
    stack;
    console.log(`error connecting ${err.stack}`);
    return;
  }
  console.log(`database connection established`);
});
global.db = db; //db are available globally

let ListRoom = [];
let index = 0;
io.on("connection", (socket) => {
  socket.on("load", () => {
    console.log("ok loaded");
    io.emit("lRooms", ListRoom);
  });
  socket.on("join", (roomid) => {
    console.log("joined with id", roomid);
    socket.join(roomid);
    for (let i = 0; i < index; i++) {
      console.log(ListRoom[i]);
    }
    let check = false;
    ListRoom.forEach((e) => {
      if (e == roomid) {
        check = true;
      }
    });
    if (!check) {
      ListRoom[index] = roomid;
      ++index;
    }
    io.emit("lRooms", ListRoom);
  });
  socket.on("chat", (roomid, message) => {
    console.log(`${roomid} and ${message}`);
    socket.join(roomid);
    io.to(roomid).emit("chat", message);
    //io.emit("chat", "CHAT");
  });
  let dis = 1;
  socket.on("disconnect", () => {
    console.log("user disconnected", ++dis);
  });
});

///////########## Game Room ##########
//----------------------------------------------------------------------------------------------
app.get("/createNamespace", function (req, res) {
  let newNamespace = "";
  while (newNamespace == "" || newNamespace in namespaces) {
    //gen random seed
    const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    newNamespace = result;
  }

  //create GameSocket
  const newSocket = io.of(`/${newNamespace}`)
  //create RoomSocket included GameSocket
  mainSocket = (newSocket, `/${newNamespace}`)
  namespaces[newNamespace] = null;
  console.log(newNamespace + " CREATED")
  res.json({ namespaces: newNamespace })
});

//mainSocket for room
mainSocket = (gameSocket, namespace) => {
  let players = []; //players in line
  let partyMembers = []; //players in room
  let partyLeader = "";
  let started = false;

  //connection
  gameSocket.on("connection", (socket) => {
    console.log("id: ", socket.id);

  })

  //
}



//----------------------------------------------------------------------------------------------




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

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
  deleteSkinUser,
  updateSkinUser,
} from "./controllers/skinUserController.js";
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
//----------------------------------------------------------------------------------------------
app.get("/getallusers", GetAllPlayers);
//user registyer
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
app.put("/skinupdate/:id", updateSkin);
//delete a skin
app.delete("/skindelete/:id", deleteSkin);
//----------------------------------------------------------------------------------------------
//add new skin_user
app.post("/addnewskinuser", addNewSkinUser);
//update skin_user
app.put("/updateskinuser/:id", updateSkinUser);
//delete skin_user row
app.delete("/deleteskinuser/:id", deleteSkinUser);

server.listen(8080, () => {
  console.log("server running at http://localhost:8080");
});

import express from "express";
import {createServer} from 'node:http';
import {Server} from 'socket.io';
import cors from "cors";
import mysql from "mysql2";
import {log} from "node:console";
const app = express();

const server = createServer(app);
app.use(cors());

const io = new Server(server, {
    connectionStateRecovery: {},
    cors : {
        origin: "http://localhost:3000"
    }
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '021103',
    database: 'CardGame'
})
db.connect((err) => {
    if(err) {
        stack
        console.log(`error connecting ${err.stack}`)
        return;
    }
    console.log(`database connection established`);
})
app.use(express.json());

let ListRoom = [];
let index = 0;
io.on('connection', (socket) => {
    socket.on('load', () => {
        console.log("ok loaded");
        io.emit('lRooms', ListRoom);
    })
    socket.on('join', (roomid) => {
        console.log("joined with id", roomid);
        socket.join(roomid);
        for(let i=0; i<index; i++) {
            console.log(ListRoom[i]);
        }
        let check = false;
        ListRoom.forEach((e) => {
            if(e == roomid) {
                check = true;
            }
        })
        if(!check) {
            ListRoom[index] = roomid;
            ++index;
        }
        io.emit('lRooms', ListRoom)
    })
    socket.on('chat', (roomid, message) => {
        console.log(`${roomid} and ${message}`)
        socket.join(roomid);
        io.to(roomid).emit('chat', message);
        //io.emit("chat", "CHAT");
    })
    let dis = 1;
    socket.on("disconnect", () => {
        console.log("user disconnected", ++dis);
    })
});

app.get('/', (_req, res) => {
  res.json({msg: "hello world"})
});

//----------------------------------------------------------------------------------------------
app.get('/getallusers', (_req, res) => {
    const query = 'select * from players';
    db.query(query, (err, data) => {
        if(err){
            console.log(`error get all player: ${err}`);
            return res.json(err);
        }
        return res.json(data);
    })
})

//user registyer
app.post('/register', (req, res) => {
    const sql = "insert into players(username, password) values(?)";
    const info = [
        req.body.username,
        req.body.password
    ];
    db.query(sql, [info], (err, data) => {
        if(err) {
            return res.send(err);
        }
        return res.status(201).json(data);
    });
});

//user login
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const sql = `select * from players where username='${username}' and password='${password}'`;
    db.query(sql, (err, data) => {
        if(err) {
            return res.send(err);
        }
        if(data.length > 0) {
            return res.status(201).json(data);
        }
        return res.status(400).json({
            msg: "cannot find any player"
        })
    });
});

//user update password
app.put('/userupdate/:id', (req, res) => {
    console.log(req.body.password)
    const sql = `update players set password=? where player_id=?`;
    const info = [
        req.body.password,
        req.params.id
    ]
    db.query(sql,[...info], (err, _data) => {
        if(err) {
            return res.status(400).json("cannot change password");
        }
        return res.status(400).json({
            msg: "ok, your password has been updated"
        })
    })
});

//----------------------------------------------------------------------------------------------
//get all group skin
app.get('/getallskingroups', (_req, res) => {
    const sql = 'select * from skin_groups';
    db.query(sql, (err, data) => {
        if(err) {
            return res.status(400).json({
                msg: "cannot get any skin_groups"
            })
        }
        return res.json(data);
    })
})

//----------------------------------------------------------------------------------------------
//get all skin
app.get('/getallskins', (_req, res) => {
    const query = 'select * from skins';
    db.query(query, (err, data) => {
        if(err){
            console.log(`error get all player: ${err}`);
            return res.json(err);
        }
        return res.json(data);
    })
})

//add new skin
app.post('/addnewskin', (req, res) => {
    const sql = "insert into skins(skin_name, skin_price, skin_group_id) values(?, ?, ?)";
    const info = [
        req.body.skin_name,
        req.body.skin_price,
        req.body.skin_group_id,
    ]
    db.query(sql,[...info], (err, data) => {
        if(err){
            console.log(`error get all player: ${err}`);
            return res.json(err);
        }
        return res.json(data);
    })
})

// update a skin
app.put('/skinupdate/:id', (req, res) => {
    console.log(req.body.password)
    const sql = "update skins set `skin_name`=?, `skin_price`=?, `skin_group_id`=? where skin_id=?";
    const info = [
        req.body.skin_name,
        req.body.skin_price,
        req.body.skin_group_id,
    ]
    db.query(sql,[...info, req.params.id], (err, _data) => {
        if(err) {
            console.log(err);
            return res.status(400).json("cannot update this skin");
        }
        return res.status(201).json({
            msg: "ok, your skin has been updated"
        })
    })
});

//delete a skin
app.delete('/skindelete/:id', (req, res) => {
    console.log(req.params.id)
    const sql = "delete from skins where skin_id=?";
    db.query(sql, [req.params.id], (err, _data) => {
        if(err) {
            return res.status(400).json({
                msg: "cannot delete skin in database"
            })
        }
        return res.json({msg: "ok, skin has been deleted"});
    })
})
//----------------------------------------------------------------------------------------------

server.listen(8080, () => {
  console.log('server running at http://localhost:8080');
});

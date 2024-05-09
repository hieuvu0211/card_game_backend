function GetAllPlayers(_req, res) {
  const query = 'SELECT * FROM Players';
  
  db.query(query, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(result);
    }
  });
}
function Register(req, res) {
  const sql = "insert into Players(username, password) values(?)";
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
}

function Login(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const sql = `select * from Players where
  username='${username}' and password='${password}'`;
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
}

function UpdatePassword(req, res) {
  const sql = `update Players set password=? where player_id=?`;
  const info = [
      req.body.password,
      req.params.id
  ];
  db.query(sql, [...info], (err, _data) => {
      if(err) {
          return res.status(400).json("cannot change password");
      }
      return res.status(400).json({
          msg: "ok, your password has been updated"
      });
  });
}
function getPlayerById(req, res) {
  const query = 'SELECT * FROM Players where player_id=?';
  const info = req.params.id
  db.query(query, info, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(result);
    }
  });
}

function updateCurrentSkin(req, res) {
  const sql = `update Players set currentSkin=? where player_id=?`;
  const info = [
      req.params.newid,
      req.params.id
  ];
  console.log("body = ", req.params.newid)
  console.log("params = ", req.params.id)
  db.query(sql, [...info], (err, _data) => {
      if(err) {
          return res.status(400).json("cannot update skin");
      }
      return res.status(200).json({
          msg: "ok, your skin has been updated"
      });
  });
}

function getPlayerByName(req, res) {
  const query = 'SELECT * FROM Players where username=?';
  const info = req.params.name
  db.query(query, info, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(result);
    }
  });
}
export {GetAllPlayers, Register, Login, UpdatePassword, getPlayerById, updateCurrentSkin, getPlayerByName};

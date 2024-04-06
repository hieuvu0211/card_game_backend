function GetAllPlayers(_req, res) {
  const query = 'SELECT * FROM players';
  
  db.query(query, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(result);
    }
  });
}
function Register(req, res) {
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
}

function Login(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const sql = `select * from players where
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
  const sql = `update players set password=? where player_id=?`;
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
export {GetAllPlayers, Register, Login, UpdatePassword};

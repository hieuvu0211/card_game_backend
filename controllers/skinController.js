function getAllSkins(_req, res) {
  const query = "select * from Skins";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(400).json({
        msg: "cannot get any Skins",
      });
    }
    return res.json(data);
  });
}
function addNewSkin(req, res) {
  const sql =
    "insert into Skins(skin_name, skin_price, skin_group_id) values(?, ?, ?)";
  const info = [
    req.body.skin_name,
    req.body.skin_price,
    req.body.skin_group_id,
  ];
  db.query(sql, [...info], (err, data) => {
    if (err) {
      return res.status(400).json({
        msg: "cannot add new skin",
      });
    }
    return res.json(data);
  });
}

function updateSkin(req, res) {
  const sql =
    "update Skins set `skin_name`=?, `skin_price`=?, `skin_group_id`=? where skin_id=?";
  const info = [
    req.body.skin_name,
    req.body.skin_price,
    req.body.skin_group_id,
    req.params.id,
  ];
  db.query(sql, [...info], (err, data) => {
    if (err) {
      return res.status(400).json({
        msg: "cannot update skin",
      });
    }
    return res.json(data);
  });
}

function deleteSkin(req, res) {
  const sql1 =
    "delete from skin_user where skin_id in (select Skins.skin_id from Skins where skin_id=?)";
  const sql2 = "delete from Skins where skin_id=?";
  db.query(sql1, [req.params.id], (err, data) => {
    if (err) {
      return res.status(400).json({
        msg: "cannot delete skin",
      });
    }
    db.query(sql2, [req.params.id], (err, data) => {
      if (err) {
        return res.status(400).json({
          msg: "cannot delete skin",
        });
      }
      return res.json(data);
    });
  });
}

function getSkinById(req, res) {
  const query = "select * from Skins where skin_id=?";
  db.query(query,req.params.id, (err, data) => {
    if (err) {
      return res.status(400).json({
        msg: "cannot get any Skins",
      });
    }
    return res.json(data);
  });
}
export { getAllSkins, addNewSkin, updateSkin, deleteSkin, getSkinById };

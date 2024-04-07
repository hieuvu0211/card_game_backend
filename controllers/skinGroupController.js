function getAllSkinGroups(req, res) {
  const sql = 'select * from skin_groups';
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(400).json({
        msg: "cannot get any skin_groups"
      });
    }
    return res.json(data);
  });
};

function addNewSkinGroup(req, res) {
  const sql = 'insert into skin_groups(skin_group_name) values(?)';
  db.query(sql, [req.body.skin_group_name], (err, _data) => {
    if (err) {
      return res.status(400).json({
        msg: "failed to create new skin_group"
      });
    }
    return res.json({
      msg: "ok"
    });
  });
};

function updateSkinGroup(req, res) {
  const sql = 'update skin_groups set skin_group_name=? where skin_group_id=?';
  const info = [
    req.body.skin_group_name,
    req.params.id
  ];
  db.query(sql, [...info], (err, _data) => {
    if (err) {
      return res.status(400).json({msg: "failed"});
    }
    return res.json({msg: "ok, updated"});
  });
}
function deleteSkinGroup(req, res) {
  //delete all elements in skin_user
  const sql1 = "delete from skin_user where skin_id in (select Skins.skin_id from skins where skin_group_id=?)";
  //delete all elements in Skins where skin_group_id=?
  const sql2 = "delete from skins where skin_group_id=?";
  //finally delete the skin_group where skin_group_id=?
  const sql3 = "delete from skin_groups where skin_group_id=?";
  db.query(sql1, [req.params.id], (err, _data) => {
    if (err) {
      return res.status(400).json({msg: "failed1"});
    }
    db.query(sql2, [req.params.id], (err, _data) => {
      if (err) {
        return res.status(400).json({msg: "failed2"});
      }

      db.query(sql3, [req.params.id], (err, _data) => {
        if (err) {
          return res.status(400).json({msg: "failed3"});
        }
        return res.json({msg: "ok, deleted"});
      });

  });
});
}
export { getAllSkinGroups, addNewSkinGroup, updateSkinGroup, deleteSkinGroup};

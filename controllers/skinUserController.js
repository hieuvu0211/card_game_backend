function addNewSkinUser(req, res) {
    const sql = "insert into skin_user(skin_id, player_id, skin_user_expried) values(?)";
    const info = [
        req.body.skin_id,
        req.body.player_id,
        req.body.skin_user_expried
    ]
    db.query(sql, [info], (err, _data) => {
        if(err) {
            return res.status(400).json({
                msg: "failed to create"
            })
        }
        return res.json({msg: "ok, created"});
    })
};

function updateSkinUser(req, res) {
    const sql = "update skin_user set skin_id=?, player_id=?, skin_user_expried=? where skin_user_id=?";
    const info = [
        req.body.skin_id,
        req.body.player_id,
        req.body.skin_user_expried,
        req.params.id
    ]
    db.query(sql, [...info], (err, _data) => {
        if(err) {
            return res.status(400).json({
                msg: "failed to update"
            })
        }
        return res.json({msg: "ok, updated"});
    })
};

function deleteSkinUserBySkinUserId(req, res) {
    console.log(req.params.id)
    const sql = "delete from skin_user where skin_user_id=?";
    db.query(sql, [req.params.id], (err, _data) => {
        if(err) {
            return res.status(400).json({
                msg: "cannot delete skin_user in database"
            })
        }
        return res.json({msg: "ok,deleted"});
    })
};

function deleteSkinUserByPlayerId(req, res) {
    const sql = "delete from skin_user where player_id=?";
    db.query(sql, [req.params.id], (err, _data) => {
        if(err) {
            return res.status(400).json({
                msg: "cannot delete skin_user in database"
            })
        }
        return res.json({msg: "ok,deleted"});
    })
};

function deleteSkinUserBySkinId(req, res) {
    const sql = "delete from skin_user where skin_id=?";
    db.query(sql, [req.params.id], (err, _data) => {
        if(err) {
            return res.status(400).json({
                msg: "cannot delete skin_user in database"
            })
        }
        return res.json({msg: "ok,deleted"});
    })
};
export {addNewSkinUser, updateSkinUser, deleteSkinUserBySkinUserId, deleteSkinUserByPlayerId, deleteSkinUserBySkinId};

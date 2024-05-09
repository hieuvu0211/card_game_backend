function GetSkinById(req, res) {
    const sql = "select * from Skin_User where player_id=?";
    const info = req.params.id;
    db.query(sql, info, (err, _data) => {
        if(err) {
            return res.status(400).json({
                msg: "failed to get"
            })
        }
        res.status(200).send(_data);
    })
};


function addNewSkinUser(req, res) {
    const sql = "insert into Skin_User(skin_id, player_id, Skin_User_expried) values(?)";
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
    const sql = "update Skin_User set skin_id=?, player_id=?, Skin_User_expried=? where Skin_User_id=?";
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
    const sql = "delete from Skin_User where Skin_User_id=?";
    db.query(sql, [req.params.id], (err, _data) => {
        if(err) {
            return res.status(400).json({
                msg: "cannot delete Skin_User in database"
            })
        }
        return res.json({msg: "ok,deleted"});
    })
};

function deleteSkinUserByPlayerId(req, res) {
    const sql = "delete from Skin_User where player_id=?";
    db.query(sql, [req.params.id], (err, _data) => {
        if(err) {
            return res.status(400).json({
                msg: "cannot delete Skin_User in database"
            })
        }
        return res.json({msg: "ok,deleted"});
    })
};

function deleteSkinUserBySkinId(req, res) {
    const sql = "delete from Skin_User where skin_id=?";
    db.query(sql, [req.params.id], (err, _data) => {
        if(err) {
            return res.status(400).json({
                msg: "cannot delete Skin_User in database"
            })
        }
        return res.json({msg: "ok,deleted"});
    })
};
export {GetSkinById,addNewSkinUser, updateSkinUser, deleteSkinUserBySkinUserId, deleteSkinUserByPlayerId, deleteSkinUserBySkinId};

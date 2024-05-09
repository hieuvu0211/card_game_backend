function getAllMatchParticipants(req, res) {
  const sql = 'SELECT * FROM Match_Participants';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(result);
    }
  });
};

function createNewMatchParticipant(req, res) {
  const { match_id, player_id, score } = req.body;
  const sql = 'INSERT INTO Match_Participants (match_id, player_id, result) VALUES (?, ?, ?)';
  let info = [req.body.match_id, req.body.player_id, req.body.result];
  db.query(sql, info, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(201).send('Match Participant created successfully');
    }
  });
};

function getMatchParticipantById(req, res) {
  const sql = 'SELECT * FROM Match_Participants WHERE player_id = ?';
  db.query(sql, req.params.match_id, (err, result) => {
    if (err) {
      res.status(500).send(`Internal Server Error: ${err}`);
    } else {
      res.status(200).send(result);
    }
  });
};

function updateMatchParticipantById(req, res) {
  const { match_id, player_id, result } = req.body;
  const sql = 'UPDATE Match_Participants SET match_id = ?, player_id = ?, result = ? WHERE match_id = ?';
  let info = [match_id, player_id, result, req.params.match_id];
  db.query(sql, info, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Match Participant updated successfully');
    }
  });
};

function deleteMatchParticipantById(req, res) {
  const sql = 'DELETE FROM Match_Participants WHERE match_id = ?';
  db.query(sql, req.params.match_id, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Match Participant deleted successfully');
    }
  });
};

export { getAllMatchParticipants, createNewMatchParticipant, getMatchParticipantById, updateMatchParticipantById, deleteMatchParticipantById};

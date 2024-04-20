function getAllMatches(req, res) {
  const sql = 'SELECT * FROM Matches';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(result);
    }
  });
}

function createNewMatch(req, res) {
  const sql = 'INSERT INTO Matches (match_date, match_details) VALUES (?, ?)';
  let info = [req.body.match_date, req.body.match_details];
  db.query(sql, info, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(201).send('Match created successfully');
    }
  });
};

function getMatchById(req, res) {
  const sql = 'SELECT * FROM Matches WHERE match_id = ?';
  db.query(sql, req.params.match_id, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(result);
    }
  });
};

function updateMatchById(req, res) {
  const { match_date, match_details } = req.body;
  const sql = 'UPDATE Matches SET match_date = ?, match_details = ? WHERE match_id = ?';
  let info = [match_date, match_details, req.params.match_id];
  db.query(sql, info, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Match updated successfully');
    }
  });
};

function deleteMatchById(req, res) {
  const sql = 'DELETE FROM Matches WHERE match_id = ?';
  db.query(sql, req.params.match_id, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Match deleted successfully');
    }
  });
}
export { getAllMatches, createNewMatch, getMatchById, updateMatchById, deleteMatchById };

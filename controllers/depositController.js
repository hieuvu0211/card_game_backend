function getAllDeposits(req, res) {
  const sql = 'SELECT * FROM Deposits_History';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(result);
    }
  });
};

function createNewDeposit(req, res) {
  const sql = 'INSERT INTO Deposits_History (player_id, deposit_amount, deposit_date) VALUES (?, ?, ?)';
  let info = [req.body.player_id, req.body.deposit_amount, req.body.deposit_date];
  db.query(sql, info, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(201).send('Deposit created successfully');
    }
  });
};

function getDepositById(req, res) {
  const sql = 'SELECT * FROM Deposit_History WHERE player_id = ?';
  db.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(result);
    }
  });
};

function updateDepositById(req, res) {
  const { player_id, deposit_amount, deposit_date } = req.body;
  const sql = 'UPDATE Deposits_History SET player_id = ?, deposit_amount = ?, deposit_date = ? WHERE deposit_id = ?';
  let info = [player_id, deposit_amount, deposit_date, req.params.deposit_id];
  db.query(sql, info, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Deposit updated successfully');
    }
  });
};

function deleteDepositById(req, res) {
  const sql = 'DELETE FROM Deposits_History WHERE deposit_id = ?';
  db.query(sql, req.params.deposit_id, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Deposit deleted successfully');
    }
  });
};

export { getAllDeposits, createNewDeposit, getDepositById, updateDepositById, deleteDepositById};

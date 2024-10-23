const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Add the following route handlers after the app.listen() call

app.post('/transactions', (req, res) => {
    const transactions = req.body;
  
    // Check if the input is an array
    if (!Array.isArray(transactions)) {
      return res.status(400).send('Input must be an array of transactions');
    }
  
    // Validate each transaction in the array
    for (const transaction of transactions) {
      if (
        !transaction.type ||
        !transaction.category ||
        !transaction.amount ||
        !transaction.date
      ) {
        return res.status(400).send('All fields are required');
      }
    }
  
    // Prepare SQL placeholders and values
    const placeholders = transactions.map(() => '(?, ?, ?, ?, ?)').join(', ');
    const values = transactions.flatMap(t => [t.type, t.category, t.amount, t.date, t.description]);
  
    // Execute the SQL query
    db.run(
      `INSERT INTO transactions (type, category, amount, date, description) VALUES ${placeholders}`,
      values,
      function (err) {
        if (err) {
          return res.status(500).send(err.message);
        }
        res.status(201).send({ inserted: this.changes });
      }
    );
  });
  

app.get('/transactions', (req, res) => {
  db.all('SELECT * FROM transactions', [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send(rows);
  });
});

app.get('/transactions/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send(row);
  });
});

app.put('/transactions/:id', (req, res) => {
  const { id } = req.params;
  const { type, category, amount, date, description } = req.body;
  db.run(
    'UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?',
    [type, category, amount, date, description, id],
    function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(200).send({ changes: this.changes });
    }
  );
});

app.delete('/transactions/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM transactions WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send({ changes: this.changes });
  });
});

app.get('/summary', (req, res) => {
  const { category, startDate, endDate } = req.query;

  let query = 'SELECT type, SUM(amount) as total FROM transactions WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }

  query += ' GROUP BY type';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    const summary = rows.reduce(
      (acc, row) => {
        if (row.type === 'income') acc.totalIncome = row.total;
        if (row.type === 'expense') acc.totalExpenses = row.total;
        acc.balance = acc.totalIncome - acc.totalExpenses;
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0, balance: 0 }
    );
    res.status(200).send(summary);
  });
});

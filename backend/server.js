const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase, getPool } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/teams', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM teams ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams', details: error.message });
  }
});

app.get('/api/teams/:id', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM teams WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team', details: error.message });
  }
});

app.post('/api/teams', async (req, res) => {
  try {
    const { name, description, budget } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const numericBudget = budget !== undefined && budget !== '' ? Number(budget) : 0;
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO teams (name, description, budget) VALUES (?, ?, ?)',
      [name.trim(), description || '', numericBudget]
    );

    res.status(201).json({
      message: 'Team created',
      team: {
        id: result.insertId,
        name: name.trim(),
        description: description || '',
        budget: numericBudget,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team', details: error.message });
  }
});

app.put('/api/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, budget } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const numericBudget = budget !== undefined && budget !== '' ? Number(budget) : 0;
    const pool = getPool();
    const [result] = await pool.query(
      'UPDATE teams SET name = ?, description = ?, budget = ? WHERE id = ?',
      [name.trim(), description || '', numericBudget, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({
      message: 'Team updated',
      team: { id: Number(id), name: name.trim(), description: description || '', budget: numericBudget },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team', details: error.message });
  }
});

app.delete('/api/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const [result] = await pool.query('DELETE FROM teams WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({ message: 'Team deleted', id: Number(id) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team', details: error.message });
  }
});

app.get('/api/games', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM games ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games', details: error.message });
  }
});

app.get('/api/games/:id', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM games WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game', details: error.message });
  }
});

app.post('/api/games', async (req, res) => {
  try {
    const { name, description, price, genre, platform, release_date } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Game name is required' });
    }

    const numericPrice = price !== undefined && price !== '' ? Number(price) : 0;
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO games (name, description, price, genre, platform, release_date) VALUES (?, ?, ?, ?, ?, ?)',
      [
        name.trim(),
        description || '',
        numericPrice,
        genre || 'General',
        platform || 'PC',
        release_date || null,
      ]
    );

    res.status(201).json({
      message: 'Game created',
      game: {
        id: result.insertId,
        name: name.trim(),
        description: description || '',
        price: numericPrice,
        genre: genre || 'General',
        platform: platform || 'PC',
        release_date: release_date || null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create game', details: error.message });
  }
});

app.put('/api/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, genre, platform, release_date } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Game name is required' });
    }

    const numericPrice = price !== undefined && price !== '' ? Number(price) : 0;
    const pool = getPool();
    const [result] = await pool.query(
      'UPDATE games SET name = ?, description = ?, price = ?, genre = ?, platform = ?, release_date = ? WHERE id = ?',
      [
        name.trim(),
        description || '',
        numericPrice,
        genre || 'General',
        platform || 'PC',
        release_date || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json({
      message: 'Game updated',
      game: {
        id: Number(id),
        name: name.trim(),
        description: description || '',
        price: numericPrice,
        genre: genre || 'General',
        platform: platform || 'PC',
        release_date: release_date || null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update game', details: error.message });
  }
});

app.delete('/api/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const [result] = await pool.query('DELETE FROM games WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json({ message: 'Game deleted', id: Number(id) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete game', details: error.message });
  }
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

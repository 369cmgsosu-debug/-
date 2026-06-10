const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database initialization
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS patrols (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                date TEXT NOT NULL
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS issues (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patrol_id INTEGER,
                description TEXT NOT NULL,
                person_in_charge TEXT,
                status TEXT DEFAULT 'open',
                FOREIGN KEY (patrol_id) REFERENCES patrols (id)
            )`);
        });
    }
});

// API Endpoints
app.get('/api/patrols', (req, res) => {
    db.all('SELECT * FROM patrols', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/patrols', (req, res) => {
    const { name, date } = req.body;
    if (!name || !date) return res.status(400).json({ error: 'Name and date are required' });
    db.run('INSERT INTO patrols (name, date) VALUES (?, ?)', [name, date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, date });
    });
});

app.get('/api/patrols/:id/issues', (req, res) => {
    db.all('SELECT * FROM issues WHERE patrol_id = ?', [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/patrols/:id/issues', (req, res) => {
    const { description, person_in_charge } = req.body;
    const patrol_id = req.params.id;
    if (!description) return res.status(400).json({ error: 'Description is required' });
    db.run('INSERT INTO issues (patrol_id, description, person_in_charge) VALUES (?, ?, ?)', 
        [patrol_id, description, person_in_charge], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, patrol_id, description, person_in_charge, status: 'open' });
    });
});

app.patch('/api/issues/:id', (req, res) => {
    const { status, person_in_charge } = req.body;
    if (!status && !person_in_charge) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    let query = 'UPDATE issues SET ';
    let params = [];
    if (status) {
        query += 'status = ?, ';
        params.push(status);
    }
    if (person_in_charge) {
        query += 'person_in_charge = ?, ';
        params.push(person_in_charge);
    }
    query = query.slice(0, -2) + ' WHERE id = ?';
    params.push(req.params.id);

    db.run(query, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Updated successfully' });
    });
});

app.get('/api/alerts', (req, res) => {
    db.all('SELECT * FROM issues WHERE status != ?', ['done'], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

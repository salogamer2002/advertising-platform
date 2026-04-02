/**
 * Q1: Debug this Express.js API
 * 
 * TASK: Find and fix 4 bugs in this code:
 * 1. SQL Injection vulnerability
 * 2. Incorrect response format
 * 3. Missing error handling
 * 4. Authentication bypass
 * 
 * Time: 20 minutes
 */

import express from 'express';
import pg from 'pg';

const app = express();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.json());

// BUG 1: SQL Injection vulnerability - user input directly in query
app.get('/campaigns', async (req, res) => {
  const { status } = req.query;
  // VULNERABLE: String concatenation allows SQL injection
  const query = `SELECT * FROM campaigns WHERE status = '${status}'`;
  const result = await pool.query(query);
  res.json(result.rows);
});

// BUG 2: Incorrect response format - should return object, returns array
app.get('/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM campaigns WHERE id = $1', [id]);
  // BUG: Returns array instead of single object
  res.json(result.rows); // Should be result.rows[0]
});

// BUG 3: Missing error handling - no try/catch
app.post('/campaigns', async (req, res) => {
  const { name, budget, client_id } = req.body;
  // BUG: No validation, no try/catch
  const result = await pool.query(
    'INSERT INTO campaigns (name, budget, client_id) VALUES ($1, $2, $3) RETURNING *',
    [name, budget, client_id]
  );
  res.status(201).json(result.rows[0]);
});

// BUG 4: Authentication bypass - JWT verification incomplete
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  // BUG: Missing token verification! Just checks if token exists
  if (token) {
    req.user = { id: 'fake-user' }; // Should verify JWT
    next();
  } else {
    res.sendStatus(401);
  }
};

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

app.listen(3000);

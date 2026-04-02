/**
 * Q1 SOLUTION: Fixed Express.js API
 * 
 * All 4 bugs have been fixed:
 * 1. SQL Injection - Now uses parameterized queries
 * 2. Incorrect response - Returns single object for single resource
 * 3. Error handling - Added try/catch and validation
 * 4. Authentication - Proper JWT verification
 */

import express from 'express';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const app = express();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.json());

// FIX 1: SQL Injection - Use parameterized query
app.get('/campaigns', async (req, res) => {
  try {
    const { status } = req.query;
    // FIXED: Parameterized query prevents SQL injection
    const query = 'SELECT * FROM campaigns WHERE status = $1';
    const result = await pool.query(query, [status]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// FIX 2: Return single object for single resource
app.get('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM campaigns WHERE id = $1', [id]);
    
    // FIXED: Return single object, handle not found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(result.rows[0]); // Single object, not array
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// FIX 3: Proper error handling and validation
app.post('/campaigns', async (req, res) => {
  try {
    const { name, budget, client_id } = req.body;
    
    // FIXED: Input validation
    if (!name || !budget || !client_id) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'name, budget, and client_id are required' 
      });
    }

    if (typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'budget must be a positive number' 
      });
    }

    const result = await pool.query(
      'INSERT INTO campaigns (name, budget, client_id) VALUES ($1, $2, $3) RETURNING *',
      [name, budget, client_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// FIX 4: Proper JWT verification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // FIXED: Actually verify the JWT token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000);

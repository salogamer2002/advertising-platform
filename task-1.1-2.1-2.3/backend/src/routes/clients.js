import { Router } from 'express';
import pool from '../db/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clients ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get clients error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/', async (req, res) => {
  try {
    const { name, industry, contact_email } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Name is required' 
      });
    }

    const result = await pool.query(
      'INSERT INTO clients (name, industry, contact_email) VALUES ($1, $2, $3) RETURNING *',
      [name, industry, contact_email]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create client error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

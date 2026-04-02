/**
 * Q5: AI-Scaffolded Express CRUD Route
 * 
 * TASK: Use GitHub Copilot or Cursor AI to scaffold a new Express route 
 *       with full CRUD in under 10 minutes
 * Time: 10 minutes
 * 
 * This demonstrates what an AI coding tool would generate for a 
 * complete CRUD resource (Products)
 */

import { Router } from 'express';
import pool from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * GET /products
 * List all products with pagination, filtering, and sorting
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'created_at', 
      order = 'desc',
      category,
      search 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const allowedSorts = ['name', 'price', 'created_at', 'stock'];
    const sortField = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    let whereConditions = ['deleted_at IS NULL'];
    let params = [];
    let paramIndex = 1;

    if (category) {
      whereConditions.push(`category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM products WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Get products
    const query = `
      SELECT id, name, description, price, category, stock, image_url, created_at, updated_at
      FROM products 
      WHERE ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const result = await pool.query(query, [...params, parseInt(limit), offset]);

    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('GET /products error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /products/:id
 * Get a single product by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('GET /products/:id error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * POST /products
 * Create a new product
 */
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, stock, image_url } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'name and price are required' 
      });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'price must be a positive number' 
      });
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price, category, stock || 0, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /products error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * PUT /products/:id
 * Update an existing product
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, image_url } = req.body;

    // Check if product exists
    const existingProduct = await pool.query(
      'SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'price must be a positive number' });
      }
      updates.push(`price = $${paramIndex++}`);
      values.push(price);
    }
    if (category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      values.push(category);
    }
    if (stock !== undefined) {
      updates.push(`stock = $${paramIndex++}`);
      values.push(stock);
    }
    if (image_url !== undefined) {
      updates.push(`image_url = $${paramIndex++}`);
      values.push(image_url);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE products 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('PUT /products/:id error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * DELETE /products/:id
 * Soft delete a product
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE products 
       SET deleted_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('DELETE /products/:id error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

/**
 * SQL Schema for this CRUD resource:
 * 
 * CREATE TABLE products (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   name VARCHAR(255) NOT NULL,
 *   description TEXT,
 *   price DECIMAL(10, 2) NOT NULL,
 *   category VARCHAR(100),
 *   stock INTEGER DEFAULT 0,
 *   image_url TEXT,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   deleted_at TIMESTAMP DEFAULT NULL
 * );
 * 
 * CREATE INDEX idx_products_category ON products(category);
 * CREATE INDEX idx_products_deleted_at ON products(deleted_at);
 */

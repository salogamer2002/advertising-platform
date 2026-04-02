import { Router } from 'express';
import pool from '../db/index.js';
import { authenticate } from '../middleware/auth.js';
import { campaignSchema, campaignUpdateSchema } from '../validation/schemas.js';

const router = Router();

// PUBLIC endpoint - No authentication required (for dashboard demo)
router.get('/public/list', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, status, budget, spend, impressions, clicks, conversions, created_at 
       FROM campaigns 
       WHERE deleted_at IS NULL 
       ORDER BY created_at DESC 
       LIMIT 50`
    );
    
    res.json({
      success: true,
      data: result.rows || []
    });
  } catch (err) {
    console.error('Error fetching public campaigns:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// All other routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Get all campaigns with filtering, sorting, and pagination
 *     tags: [Campaigns]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: client_id
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: 'created_at' }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: 'desc' }
 *     responses:
 *       200: { description: List of campaigns }
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      client_id, 
      sort = 'created_at', 
      order = 'desc',
      search
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const allowedSortFields = ['name', 'budget', 'spend', 'impressions', 'clicks', 'created_at', 'status'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    let whereConditions = ['c.deleted_at IS NULL'];
    let params = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`c.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (client_id) {
      whereConditions.push(`c.client_id = $${paramIndex}`);
      params.push(client_id);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`c.name ILIKE $${paramIndex}`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM campaigns c WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get campaigns with computed metrics
    const result = await pool.query(
      `SELECT 
        c.*,
        cl.name as client_name,
        CASE WHEN c.impressions > 0 THEN ROUND((c.clicks::DECIMAL / c.impressions * 100), 2) ELSE 0 END as ctr,
        CASE WHEN c.spend > 0 THEN ROUND((c.conversions::DECIMAL * c.budget / c.spend), 2) ELSE 0 END as roas
      FROM campaigns c
      LEFT JOIN clients cl ON c.client_id = cl.id
      WHERE ${whereClause}
      ORDER BY c.${sortField} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Get campaigns error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Get a single campaign with full metrics
 *     tags: [Campaigns]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        c.*,
        cl.name as client_name,
        CASE WHEN c.impressions > 0 THEN ROUND((c.clicks::DECIMAL / c.impressions * 100), 2) ELSE 0 END as ctr,
        CASE WHEN c.spend > 0 THEN ROUND((c.conversions::DECIMAL * c.budget / c.spend), 2) ELSE 0 END as roas
      FROM campaigns c
      LEFT JOIN clients cl ON c.client_id = cl.id
      WHERE c.id = $1 AND c.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Campaign not found' 
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get campaign error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaigns]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/', async (req, res) => {
  try {
    const { error, value } = campaignSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: error.details[0].message 
      });
    }

    const { 
      client_id, name, status, budget, spend, 
      impressions, clicks, conversions, start_date, end_date 
    } = value;

    const result = await pool.query(
      `INSERT INTO campaigns 
        (client_id, name, status, budget, spend, impressions, clicks, conversions, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [client_id, name, status, budget, spend, impressions, clicks, conversions, start_date, end_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create campaign error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     summary: Update a campaign
 *     tags: [Campaigns]
 *     security: [{ bearerAuth: [] }]
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = campaignUpdateSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: error.details[0].message 
      });
    }

    // Build dynamic update query
    const fields = Object.keys(value);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    const values = Object.values(value);

    const result = await pool.query(
      `UPDATE campaigns 
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND deleted_at IS NULL 
       RETURNING *`,
      [id, ...values]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Campaign not found' 
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update campaign error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     summary: Soft delete a campaign
 *     tags: [Campaigns]
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE campaigns 
       SET deleted_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND deleted_at IS NULL 
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Campaign not found' 
      });
    }

    res.json({ message: 'Campaign deleted successfully' });
  } catch (err) {
    console.error('Delete campaign error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /campaigns/{id}/metrics:
 *   get:
 *     summary: Get campaign metrics history for charts (30-day trend)
 *     tags: [Campaigns]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id/metrics', async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT date, impressions, clicks, conversions, spend,
        CASE WHEN impressions > 0 THEN ROUND((clicks::DECIMAL / impressions * 100), 2) ELSE 0 END as ctr
      FROM campaign_metrics
      WHERE campaign_id = $1 AND date >= CURRENT_DATE - INTERVAL '1 day' * $2
      ORDER BY date ASC`,
      [id, parseInt(days)]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get metrics error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

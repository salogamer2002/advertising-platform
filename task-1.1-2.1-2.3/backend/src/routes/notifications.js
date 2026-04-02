import { Router } from 'express';
import pool from '../db/index.js';
import { authenticate } from '../middleware/auth.js';
import { alertThresholdSchema } from '../validation/schemas.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, unread_only = false } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = 'user_id = $1';
    if (unread_only === 'true') {
      whereClause += ' AND is_read = false';
    }

    const result = await pool.query(
      `SELECT n.*, c.name as campaign_name
       FROM notifications n
       LEFT JOIN campaigns c ON n.campaign_id = c.id
       WHERE ${whereClause}
       ORDER BY n.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, parseInt(limit), offset]
    );

    // Get unread count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
      [req.user.id]
    );

    res.json({
      data: result.rows,
      unread_count: parseInt(countResult.rows[0].count)
    });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/read-all', async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [req.user.id]
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /notifications/thresholds:
 *   get:
 *     summary: Get alert thresholds for campaigns
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/thresholds', async (req, res) => {
  try {
    const { campaign_id } = req.query;

    let query = `
      SELECT at.*, c.name as campaign_name
      FROM alert_thresholds at
      JOIN campaigns c ON at.campaign_id = c.id
    `;
    let params = [];

    if (campaign_id) {
      query += ' WHERE at.campaign_id = $1';
      params.push(campaign_id);
    }

    query += ' ORDER BY at.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Get thresholds error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /notifications/thresholds:
 *   post:
 *     summary: Create alert threshold
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/thresholds', async (req, res) => {
  try {
    const { error, value } = alertThresholdSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: error.details[0].message 
      });
    }

    const { campaign_id, metric_type, threshold_value, comparison } = value;

    const result = await pool.query(
      `INSERT INTO alert_thresholds (campaign_id, metric_type, threshold_value, comparison)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [campaign_id, metric_type, threshold_value, comparison]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create threshold error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /notifications/thresholds/{id}:
 *   delete:
 *     summary: Delete alert threshold
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/thresholds/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM alert_thresholds WHERE id = $1', [id]);
    res.json({ message: 'Threshold deleted successfully' });
  } catch (err) {
    console.error('Delete threshold error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

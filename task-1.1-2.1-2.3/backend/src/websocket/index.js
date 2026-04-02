import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import pool from '../db/index.js';

const clients = new Map();

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', async (ws, req) => {
    // Extract token from query string
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(4001, 'Authentication required');
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.userId = decoded.id;
      clients.set(decoded.id, ws);

      console.log(`WebSocket connected: User ${decoded.id}`);

      // Send initial unread count
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
        [decoded.id]
      );

      ws.send(JSON.stringify({
        type: 'INIT',
        unread_count: parseInt(countResult.rows[0].count)
      }));

      ws.on('close', () => {
        clients.delete(decoded.id);
        console.log(`WebSocket disconnected: User ${decoded.id}`);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(decoded.id);
      });

    } catch (error) {
      ws.close(4002, 'Invalid token');
    }
  });

  return wss;
}

export async function sendNotification(userId, notification) {
  const ws = clients.get(userId);
  
  // Save to database
  try {
    const result = await pool.query(
      `INSERT INTO notifications (campaign_id, user_id, type, title, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [notification.campaign_id, userId, notification.type, notification.title, notification.message]
    );

    // Send via WebSocket if connected
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify({
        type: 'NOTIFICATION',
        data: result.rows[0]
      }));
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error saving notification:', error);
  }
}

export async function broadcastToAll(message) {
  const payload = JSON.stringify(message);
  for (const [userId, ws] of clients) {
    if (ws.readyState === 1) {
      ws.send(payload);
    }
  }
}

// Alert checking function - called periodically or on metric updates
export async function checkAlertThresholds(campaignId) {
  try {
    // Get campaign data
    const campaignResult = await pool.query(
      `SELECT c.*, 
        CASE WHEN c.impressions > 0 THEN (c.clicks::DECIMAL / c.impressions * 100) ELSE 0 END as ctr,
        CASE WHEN c.spend > 0 THEN (c.conversions::DECIMAL * c.budget / c.spend) ELSE 0 END as roas,
        (c.spend / c.budget * 100) as spend_percentage
       FROM campaigns c WHERE c.id = $1`,
      [campaignId]
    );

    if (campaignResult.rows.length === 0) return;

    const campaign = campaignResult.rows[0];

    // Get thresholds for this campaign
    const thresholdsResult = await pool.query(
      'SELECT * FROM alert_thresholds WHERE campaign_id = $1 AND is_active = true',
      [campaignId]
    );

    for (const threshold of thresholdsResult.rows) {
      let currentValue;
      switch (threshold.metric_type) {
        case 'ctr':
          currentValue = parseFloat(campaign.ctr);
          break;
        case 'spend':
          currentValue = parseFloat(campaign.spend_percentage);
          break;
        case 'roas':
          currentValue = parseFloat(campaign.roas);
          break;
        case 'conversions':
          currentValue = campaign.conversions;
          break;
        default:
          continue;
      }

      const thresholdValue = parseFloat(threshold.threshold_value);
      let shouldAlert = false;

      if (threshold.comparison === 'below' && currentValue < thresholdValue) {
        shouldAlert = true;
      } else if (threshold.comparison === 'above' && currentValue > thresholdValue) {
        shouldAlert = true;
      }

      if (shouldAlert) {
        // Get all users (in production, you'd have campaign-user assignments)
        const usersResult = await pool.query('SELECT id FROM users');
        
        for (const user of usersResult.rows) {
          await sendNotification(user.id, {
            campaign_id: campaignId,
            type: 'THRESHOLD_ALERT',
            title: `Alert: ${campaign.name}`,
            message: `${threshold.metric_type.toUpperCase()} is ${threshold.comparison} threshold: ${currentValue.toFixed(2)} (threshold: ${thresholdValue})`
          });
        }
      }
    }
  } catch (error) {
    console.error('Error checking thresholds:', error);
  }
}

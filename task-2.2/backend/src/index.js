import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import logger from './utils/logger.js';
import { generateCopy, generateSocial, generateHashtags, streamCopy } from './services/aiService.js';

dotenv.config();

const app = express();

// Trust proxy (required for Vercel)
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging with unique IDs
app.use((req, res, next) => {
  req.requestId = uuidv4();
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path}`, {
      requestId: req.requestId,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });
  
  next();
});

/**
 * @route GET /
 * @description Root endpoint with service information
 */
app.get('/', (req, res) => {
  res.json({
    service: 'AI Content Microservice',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      generateCopy: 'POST /generate/copy',
      generateSocial: 'POST /generate/social',
      generateHashtags: 'POST /generate/hashtags',
      streamCopy: 'POST /generate/copy/stream',
    }
  });
});

/**
 * @route GET /health
 * @description Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ai-content-microservice',
    message: 'Service is running',
    timestamp: new Date().toISOString(),
    model: 'gpt-4-turbo-preview',
  });
});

/**
 * @route POST /generate/copy
 * @description Generate advertising copy
 * @body { product, tone, platform, word_limit }
 */
app.post('/generate/copy', async (req, res) => {
  try {
    const { product, tone, platform, word_limit } = req.body;

    // Validation
    if (!product || !tone || !platform) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Required fields: product, tone, platform',
        requestId: req.requestId,
      });
    }

    const result = await generateCopy({ product, tone, platform, word_limit });

    res.json({
      success: true,
      requestId: req.requestId,
      data: result,
    });
  } catch (error) {
    logger.error('Generate copy error', { requestId: req.requestId, error: error.message });
    res.status(500).json({
      error: 'Generation Failed',
      message: error.message,
      requestId: req.requestId,
    });
  }
});

/**
 * @route POST /generate/social
 * @description Generate social media content
 * @body { platform, campaign_goal, brand_voice }
 */
app.post('/generate/social', async (req, res) => {
  try {
    const { platform, campaign_goal, brand_voice } = req.body;

    // Validation
    if (!platform || !campaign_goal || !brand_voice) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Required fields: platform, campaign_goal, brand_voice',
        requestId: req.requestId,
      });
    }

    const validPlatforms = ['instagram', 'linkedin', 'twitter', 'facebook'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Platform must be one of: ${validPlatforms.join(', ')}`,
        requestId: req.requestId,
      });
    }

    const result = await generateSocial({ 
      platform: platform.toLowerCase(), 
      campaign_goal, 
      brand_voice 
    });

    res.json({
      success: true,
      requestId: req.requestId,
      data: result,
    });
  } catch (error) {
    logger.error('Generate social error', { requestId: req.requestId, error: error.message });
    res.status(500).json({
      error: 'Generation Failed',
      message: error.message,
      requestId: req.requestId,
    });
  }
});

/**
 * @route POST /generate/hashtags
 * @description Generate relevant hashtags
 * @body { content, industry }
 */
app.post('/generate/hashtags', async (req, res) => {
  try {
    const { content, industry } = req.body;

    // Validation
    if (!content || !industry) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Required fields: content, industry',
        requestId: req.requestId,
      });
    }

    const result = await generateHashtags({ content, industry });

    res.json({
      success: true,
      requestId: req.requestId,
      data: result,
    });
  } catch (error) {
    logger.error('Generate hashtags error', { requestId: req.requestId, error: error.message });
    res.status(500).json({
      error: 'Generation Failed',
      message: error.message,
      requestId: req.requestId,
    });
  }
});

/**
 * @route POST /generate/copy/stream
 * @description Stream advertising copy generation using SSE
 * @body { product, tone, platform, word_limit }
 */
app.post('/generate/copy/stream', async (req, res) => {
  try {
    const { product, tone, platform, word_limit } = req.body;

    // Validation
    if (!product || !tone || !platform) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Required fields: product, tone, platform',
        requestId: req.requestId,
      });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Request-Id', req.requestId);

    // Send initial event
    res.write(`data: ${JSON.stringify({ type: 'start', requestId: req.requestId })}\n\n`);

    await streamCopy({ product, tone, platform, word_limit }, (chunk) => {
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
    });

    // Send completion event
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    logger.error('Stream copy error', { requestId: req.requestId, error: error.message });
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { requestId: req.requestId, error: err.message, stack: err.stack });
  res.status(500).json({
    error: 'Internal Server Error',
    requestId: req.requestId,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Endpoint not found',
    requestId: req.requestId,
  });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  logger.info(`AI Content Microservice running on port ${PORT}`);
});

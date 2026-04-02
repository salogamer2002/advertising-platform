import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import authRoutes from './routes/auth.js';
import campaignRoutes from './routes/campaigns.js';
import clientRoutes from './routes/clients.js';
import notificationRoutes from './routes/notifications.js';
import { setupWebSocket } from './websocket/index.js';

dotenv.config();

const app = express();
const server = createServer(app);

// Trust proxy (required for Vercel and rate limiting)
app.set('trust proxy', 1);

// Setup WebSocket
setupWebSocket(server);

// Swagger configuration
const getServerUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://advertising-api.salogamer2002.vercel.app';
  }
  return `http://localhost:${process.env.PORT || 3001}`;
};

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Campaign Management API',
      version: '1.0.0',
      description: 'RESTful API for managing advertising campaigns',
    },
    servers: [{ url: getServerUrl() }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Rate limiting: 100 requests per IP per minute
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests', message: 'Please try again later' },
});
app.use(limiter);

// Request logging with unique IDs
app.use((req, res, next) => {
  req.requestId = uuidv4();
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.requestId}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    api: 'Campaign Management API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
      auth: '/auth',
      campaigns: '/campaigns',
      clients: '/clients',
      notifications: '/notifications'
    }
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/clients', clientRoutes);
app.use('/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${req.requestId}] Error:`, err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    requestId: req.requestId 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`WebSocket: ws://localhost:${PORT}/ws`);
});

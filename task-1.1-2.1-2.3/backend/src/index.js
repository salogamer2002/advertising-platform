import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import authRoutes from './routes/auth.js';
import campaignRoutes from './routes/campaigns.js';
import clientRoutes from './routes/clients.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();

// Trust proxy (required for Vercel and rate limiting)
app.set('trust proxy', 1);

// Swagger configuration
const getServerUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://advertising-api.vercel.app';
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

// Middleware - Order matters!
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
      fontSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
    },
  },
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Swagger JSON endpoint
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Documentation - Custom HTML with CDN-based Swagger UI (works on Vercel)
app.get('/api-docs', (req, res) => {
  const swaggerUiAssetPath = '/api-docs-assets';
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>API Docs - Campaign Management API</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css">
      <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin: 0; background: #fafafa; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js"></script>
      <script>
        window.onload = function() {
          const ui = SwaggerUIBundle({
            url: "/swagger.json",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });
          window.ui = ui;
        }
      </script>
    </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

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

// Rate limiting: 100 requests per IP per minute (AFTER Swagger UI)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests', message: 'Please try again later' },
  skip: (req) => req.path === '/api-docs' || req.path === '/swagger.json',
});
app.use(limiter);

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;

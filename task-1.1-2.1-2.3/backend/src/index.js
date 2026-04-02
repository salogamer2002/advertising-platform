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

// API Documentation - Custom HTML with proper authorization support
app.get('/api-docs', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Campaign Management API - Documentation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header h1 { color: #2c3e50; margin-bottom: 10px; }
    .header p { color: #7f8c8d; }
    .auth-section { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .auth-section h2 { color: #2c3e50; margin-bottom: 15px; font-size: 16px; }
    .form-group { margin-bottom: 12px; }
    label { display: block; margin-bottom: 5px; color: #34495e; font-weight: 500; font-size: 14px; }
    input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; font-family: monospace; }
    button { background: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
    button:hover { background: #2980b9; }
    .endpoints { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .endpoints h2 { color: #2c3e50; margin-bottom: 20px; font-size: 16px; }
    .endpoint { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #ecf0f1; }
    .endpoint:last-child { border-bottom: none; }
    .method { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-right: 10px; }
    .get { background: #61affe; color: white; }
    .post { background: #49cc90; color: white; }
    .put { background: #fca130; color: white; }
    .delete { background: #f93e3e; color: white; }
    .path { font-family: monospace; color: #2c3e50; margin-bottom: 8px; }
    .description { color: #7f8c8d; margin-bottom: 8px; font-size: 14px; }
    .code-block { background: #f8f8f8; padding: 12px; border-left: 3px solid #3498db; margin: 10px 0; font-family: monospace; font-size: 12px; overflow-x: auto; }
    .status { padding: 20px; background: #e8f4f8; border-left: 4px solid #3498db; margin: 10px 0; border-radius: 4px; }
    .status.error { background: #fadbd8; border-left-color: #e74c3c; }
    .status.success { background: #d5f4e6; border-left-color: #27ae60; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Campaign Management API</h1>
      <p>Complete REST API for managing advertising campaigns, clients, and real-time notifications</p>
      <p style="margin-top: 10px;"><strong>Version:</strong> 1.0.0 | <strong>Base URL:</strong> <code>https://advertising-api.vercel.app</code></p>
    </div>

    <div class="auth-section">
      <h2>🔐 Authentication Setup</h2>
      <p style="margin-bottom: 15px; color: #7f8c8d; font-size: 14px;">All API endpoints require a JWT token. Enter your token below:</p>
      <div class="form-group">
        <label for="authToken">JWT Token:</label>
        <input type="password" id="authToken" placeholder="Bearer token or your JWT secret" value="super-secret-key-2024-advertising-platform-!@#$%">
      </div>
      <button onclick="copyAuthHeader()">📋 Copy Authorization Header</button>
      <div id="authOutput" style="margin-top: 10px;"></div>
    </div>

    <div class="endpoints">
      <h2>📡 API Endpoints</h2>

      <div class="endpoint">
        <div><span class="method get">GET</span> <span class="path">/</span></div>
        <div class="description">Get API information and available endpoints</div>
        <div class="code-block">curl -X GET https://advertising-api.vercel.app/</div>
        <div class="status success">200 OK</div>
      </div>

      <div class="endpoint">
        <div><span class="method get">GET</span> <span class="path">/health</span></div>
        <div class="description">Health check endpoint - verify server is running</div>
        <div class="code-block">curl -X GET https://advertising-api.vercel.app/health</div>
        <div class="status success">200 OK</div>
      </div>

      <div class="endpoint">
        <div><span class="method get">GET</span> <span class="path">/swagger.json</span></div>
        <div class="description">Get full OpenAPI/Swagger specification in JSON format</div>
        <div class="code-block">curl -X GET https://advertising-api.vercel.app/swagger.json</div>
        <div class="status success">200 OK - Returns OpenAPI 3.0.0 spec</div>
      </div>

      <div class="endpoint">
        <div><span class="method post">POST</span> <span class="path">/auth/login</span></div>
        <div class="description">Authenticate and receive JWT token</div>
        <div class="code-block">curl -X POST https://advertising-api.vercel.app/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"password"}'</div>
        <div class="status success">200 OK - Returns JWT token</div>
      </div>

      <div class="endpoint">
        <div><span class="method get">GET</span> <span class="path">/campaigns</span></div>
        <div class="description">List all campaigns with pagination</div>
        <div class="code-block">curl -X GET https://advertising-api.vercel.app/campaigns \\
  -H "Authorization: Bearer YOUR_TOKEN"</div>
        <div class="status success">200 OK - Returns array of campaigns</div>
      </div>

      <div class="endpoint">
        <div><span class="method post">POST</span> <span class="path">/campaigns</span></div>
        <div class="description">Create a new campaign</div>
        <div class="code-block">curl -X POST https://advertising-api.vercel.app/campaigns \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Q4 Campaign","status":"active","budget":50000}'</div>
        <div class="status success">201 Created</div>
      </div>

      <div class="endpoint">
        <div><span class="method get">GET</span> <span class="path">/clients</span></div>
        <div class="description">List all client accounts</div>
        <div class="code-block">curl -X GET https://advertising-api.vercel.app/clients \\
  -H "Authorization: Bearer YOUR_TOKEN"</div>
        <div class="status success">200 OK - Returns array of clients</div>
      </div>

      <div class="endpoint">
        <div><span class="method get">GET</span> <span class="path">/notifications</span></div>
        <div class="description">Get real-time notifications and updates</div>
        <div class="code-block">curl -X GET https://advertising-api.vercel.app/notifications \\
  -H "Authorization: Bearer YOUR_TOKEN"</div>
        <div class="status success">200 OK - Returns notifications array</div>
      </div>

      <div class="endpoint">
        <div><span class="method get">GET</span> <span class="path">/api-docs</span></div>
        <div class="description">This API documentation page</div>
        <div class="code-block">https://advertising-api.vercel.app/api-docs</div>
        <div class="status success">200 OK</div>
      </div>
    </div>

    <div class="endpoints" style="margin-top: 20px;">
      <h2>🔑 Authorization Methods</h2>
      <div class="endpoint">
        <div><strong>Method 1: Bearer Token (Recommended)</strong></div>
        <div class="code-block">Authorization: Bearer YOUR_JWT_TOKEN</div>
      </div>
      <div class="endpoint">
        <div><strong>Method 2: Using cURL</strong></div>
        <div class="code-block">curl -X GET https://advertising-api.vercel.app/campaigns \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"</div>
      </div>
      <div class="endpoint">
        <div><strong>Method 3: Using Fetch API</strong></div>
        <div class="code-block">fetch('https://advertising-api.vercel.app/campaigns', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})
  .then(response => response.json())
  .then(data => console.log(data))</div>
      </div>
    </div>
  </div>

  <script>
    function copyAuthHeader() {
      const token = document.getElementById('authToken').value;
      const header = \`Authorization: Bearer \${token}\`;
      navigator.clipboard.writeText(header).then(() => {
        const output = document.getElementById('authOutput');
        output.innerHTML = '<div class="status success">✅ Copied to clipboard:<br><code style="font-size: 12px;">' + header.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></div>';
        setTimeout(() => { output.innerHTML = ''; }, 3000);
      });
    }
  </script>
</body>
</html>
  `;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
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

import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import route modules
import authRoutes from './modules/auth/routes.js';
import userRoutes from './modules/users/routes.js';
import postRoutes from './modules/posts/routes.js';
import commentRoutes from './modules/comments/routes.js';
import professionalRoutes from './modules/professionals/routes.js';
import blogRoutes from './modules/blogs/routes.js';
import reportRoutes from './modules/reports/routes.js';
import adminRoutes from './modules/admin/routes.js';

const app: Application = express();

// Middleware - CORS configuration
const allowedOrigins = [
  env.CORS_ORIGIN,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://127.0.0.1:50138',
  'http://127.0.0.1:50139',
  'http://127.0.0.1:50140',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin) || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route - API info
app.get('/', (_req, res) => {
  res.json({
    success: true,
    name: 'Addis Tesfa API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      posts: '/api/posts',
      comments: '/api/comments',
      professionals: '/api/professionals',
      blogs: '/api/blogs',
      reports: '/api/reports',
      admin: '/api/admin',
    },
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

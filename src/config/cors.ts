export default {
  origin: process.env.CORS_ALLOWED_ORIGIN || 'http://localhost:5173',
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization', 'RefreshToken'],
  exposedHeaders: ['Content-Length', 'Content-Type', 'RefreshToken', 'Token', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}

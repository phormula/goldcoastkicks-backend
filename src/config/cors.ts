const origins = process.env.CORS_ALLOWED_ORIGIN?.split('***')

export default {
  origin: origins,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization', 'RefreshToken'],
  exposedHeaders: ['Content-Length', 'Content-Type', 'RefreshToken', 'Token', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}

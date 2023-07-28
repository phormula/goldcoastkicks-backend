import webRouter from '@routes/web'
import apiRouter from '@routes/api'

export default function routes(app) {
  app.use('/', webRouter)
  app.use('/api', apiRouter)
}

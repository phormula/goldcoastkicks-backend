import webRouter from '@routes/web'
import apiRouter from '@routes/api'

export default function routes(app: any) {
  app.use('/', webRouter)
  app.use('/api', apiRouter)
}

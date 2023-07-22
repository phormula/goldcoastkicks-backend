import webRouter from '@routes/web'
import apiRouter from '@routes/api'

function routes(app) {
  app.use('/', webRouter)
  app.use('/api', apiRouter)
}

export default routes

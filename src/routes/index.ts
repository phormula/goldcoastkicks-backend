import { Request, Response } from 'express'
import webRouter from '@routes/web'
import apiRouter from '@routes/api'

export default function routes(app: any) {
  app.use('/api', apiRouter)

  app.all('/api/*', (_: Request, res: Response) => {
    res.status(404).json({ status: 'error', message: 'Resource not found' })
  })

  app.use('/', webRouter)
}

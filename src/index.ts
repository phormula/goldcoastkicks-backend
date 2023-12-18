import 'dotenv/config'
import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')
import { createServer } from 'http'
import { createServer as _createServer } from 'https'
import express, { urlencoded } from 'express'
import { join } from 'path'
import cors from 'cors'
import { Model } from 'objection'
import alias from './alias'
alias()

import * as config from '@app/config'
import db from '@app/database/knexdb'
import routes from '@app/routes'
import LoggerService from '@app/services/Logger.service'
import errorHandler from '@app/middleware/errorHandler'
import { authenticationMiddleware } from '@app/middleware'
import { readFileSync } from 'fs'

const app = express()
const PORT = process.env.PORT || 50001

// Initialize knex.
Model.knex(db)

db.on('query', (queryData: any) => {
  if (process.env.NODE_ENV === 'production') {
    LoggerService.logEvents(queryData.sql, 'sql_queries.log')
  }
})

app.use(LoggerService.requestlogger)
// Cross Origin Resource Sharing
app.use(cors(config.corsConfig))

app.use(urlencoded({ extended: true }))

app.use(express.json())

app.use(authenticationMiddleware)
app.use('/', express.static(join(__dirname, '/public')))
app.use('/auth', express.static(join(__dirname, '/public')))
app.use('/file/image', express.static(join(__dirname, 'resources', 'static', 'assets', 'uploads')))

routes(app)

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', (ip: string) => {
    if (ip === '127.0.0.1' || ip === '123.123.123.123') return true
    return false
  })
  import('./views/build/handler.mjs')
    .then((module) => app.use(module.handler))
    .catch((error) => {
      console.error('Error importing module:', error)
    })
} else {
  app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
      res.sendFile(join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
      res.json({ error: '404 Not Found' })
    } else {
      res.type('txt').send('404 Not Found')
    }
  })
}

app.all('/api/*', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Resource not found' })
})

app.use(errorHandler)

if (process.env.NODE_ENV !== 'production') {
  //   createServer(app).listen(PORT, () => {
  //     console.log(`Dev Server running on port ${PORT}`)
  //   })
  _createServer(
    {
      key: readFileSync('sneakers.dentricelectrical.com-key.pem'),
      cert: readFileSync('sneakers.dentricelectrical.com.pem'),
    },
    app,
  ).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
} else {
  createServer(app).listen(PORT, () => {
    console.log(`Production Server running on port ${PORT}`)
  })
}
// app.listen(PORT, () => console.log(`DEV Server running on port ${PORT}`))

export default app

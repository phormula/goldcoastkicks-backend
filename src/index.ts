import 'dotenv/config'
import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')
import { createServer } from 'http'
import { createServer as _createServer } from 'https'
import { readFileSync } from 'fs'
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

const app = express()
const PORT = process.env.PORT || 3501

// Initialize knex.
Model.knex(db)

db.on('query', (queryData: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('SQL Query:', queryData.sql)
  } else {
    LoggerService.logEvents(queryData.sql, 'sql_queries.txt')
  }
})

// custom middleware logger
app.use(LoggerService.requestlogger)
app.options('*', cors())
// Cross Origin Resource Sharing
app.use(cors(config.corsConfig))

// built-in middleware to handle urlencoded form data
app.use(urlencoded({ extended: true }))

// built-in middleware for json
app.use(express.json())

app.use(authenticationMiddleware)
//serve static files
app.use('/', express.static(join(__dirname, '/public')))
app.use('/auth', express.static(join(__dirname, '/public')))
app.use('/file/image', express.static(join(__dirname, 'resources', 'static', 'assets', 'uploads')))

routes(app)

app.all('/api/*', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Resource not found' })
})

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

app.use(errorHandler)

if (process.env.NODE_ENV !== 'production') {
  _createServer(
    {
      key: readFileSync('key.pem'),
      cert: readFileSync('certificate.pem'),
    },
    app,
  ).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
} else {
  _createServer(
    {
      key: readFileSync('key.pem'),
      cert: readFileSync('certificate.crt'),
      ca: readFileSync('intermediate.crt'),
    },
    app,
  ).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app

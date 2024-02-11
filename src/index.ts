import 'dotenv/config'
// import dns from 'dns'
// dns.setDefaultResultOrder('ipv4first')
import { createServer } from 'http'
import { createServer as _createServer } from 'https'
import express, { urlencoded } from 'express'
import { join } from 'path'
import cors from 'cors'
import { Model } from 'objection'
import { readFileSync } from 'fs'
import cookieParser from 'cookie-parser'
import alias from './alias'
alias()

import * as config from '@app/config'
import db from '@app/database/knexdb'
import routes from '@app/routes'
import LoggerService from '@app/services/Logger.service'
import errorHandler from '@app/middleware/errorHandler'
import { authenticationMiddleware } from '@app/middleware'

const app = express()
const PORT = process.env.PORT || 50001
let nodeModulesPath: string

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
app.use(cookieParser())

app.use(urlencoded({ extended: true }))

app.use(express.json())

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', (ip: string) => {
    if (ip === '127.0.0.1' || ip === '123.123.123.123') return true
    return false
  })
  nodeModulesPath = join(__dirname, 'node_modules')
} else {
  nodeModulesPath = join(__dirname, '..', 'node_modules')
}

app.use('/', express.static(join(__dirname, '/public')))
app.use('/auth', express.static(join(__dirname, '/public')))
app.use('/', express.static(join(nodeModulesPath, 'bootstrap', 'dist', 'css')))
app.use('/', express.static(join(nodeModulesPath, '@fortawesome', 'fontawesome-free', 'css')))
app.use('/webfonts', express.static(join(nodeModulesPath, '@fortawesome', 'fontawesome-free', 'webfonts')))
app.use('/file/image', express.static(join(__dirname, 'resources', 'static', 'assets', 'uploads')))
app.set('view engine', 'ejs')
app.use(authenticationMiddleware)
routes(app)

app.use(errorHandler)

if (process.env.NODE_ENV !== 'production') {
  //   createServer(app).listen(PORT, () => {
  //     console.log(`Dev Server running on port ${PORT}`)
  //   })
  _createServer(
    {
      key: readFileSync('test.goldcoastkicks.com-key.pem'),
      cert: readFileSync('test.goldcoastkicks.com.pem'),
    },
    app,
  ).listen(PORT, () => {
    console.log(`Dev Server running on port ${PORT}`)
  })
} else {
  createServer(app).listen(PORT, () => {
    console.log(`Production Server running on port ${PORT}`)
  })
}
// app.listen(PORT, () => console.log(`DEV Server running on port ${PORT}`))

export default app

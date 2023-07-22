import 'dotenv/config'
import { createServer } from 'http'
import { createServer as _createServer } from 'https'
import { readFileSync } from 'fs'
import express, { urlencoded, json } from 'express'
import { join } from 'path'
import cors from 'cors'
import corsOptions from '@app/config'
import { logger } from '@app/middleware/logEvents'
import errorHandler from '@app/middleware/errorHandler'
import knex from 'knex'
import knexConfig from '@app/knexfile'
import { Model } from 'objection'
import routes from '@app/routes'
import { authenticationMiddleware } from '@app/middleware'

const app = express()
const PORT = process.env.PORT || 3500

// Initialize knex.
const knexdb = knex(knexConfig[process.env.NODE_ENV])
Model.knex(knexdb)

// custom middleware logger
app.use(logger)

// Cross Origin Resource Sharing
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded form data
app.use(urlencoded({ extended: false }))

// built-in middleware for json
app.use(json())

app.use(authenticationMiddleware)
//serve static files
app.use('/', express.static(join(__dirname, '/public')))
app.use('/auth', express.static(join(__dirname, '/public')))

routes(app)

app.all('/api/*', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Resource not found' })
})

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(join(__dirname, 'src', 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

app.use(errorHandler)

if (process.env.NODE_ENV !== 'production') {
  createServer(app).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
} else {
  _createServer(
    {
      key: readFileSync('key.pem'),
      cert: readFileSync('cert.pem'),
    },
    app,
  ).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app

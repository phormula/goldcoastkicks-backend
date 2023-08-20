import express from 'express'
import expressListEndpoints from 'express-list-endpoints'
import alias from '../alias'
alias()
import routes from '@app/routes'

const app = express()
routes(app)
const endpoints = expressListEndpoints(app)

endpoints.forEach((endpoint) => {
  console.log(`${endpoint.methods.join(', ')} -> ${endpoint.path}`)
})

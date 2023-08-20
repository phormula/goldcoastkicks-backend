import knex from 'knex'
import knexConfig from '@app/knexfile'

const environment: string = process.env.NODE_ENV || 'development'
const config = knexConfig[environment] as any

const db = knex(config)

export default db

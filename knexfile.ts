import 'dotenv/config'
import { EnvironmentConfig } from './src/types/config.type'

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config: { [key: string]: EnvironmentConfig } = {
  development: {
    client: process.env.DB_CONNECTION,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: { directory: './src/database/migrations' },
    seeds: { directory: './src/database/seeders' },
  },

  test: {
    client: process.env.DB_CONNECTION,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: `${process.env.DB_DATABASE}_test`,
    },
    migrations: { directory: './src/database/migrations' },
    seeds: { directory: './src/database/seeders' },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: process.env.DB_CONNECTION,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: { directory: './database/migrations' },
    seeds: { directory: './database/seeders' },
  },
}

export default config

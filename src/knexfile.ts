import 'dotenv/config'
import { Knex } from 'knex'
import moment from 'moment'

const defaultConfig: Knex.Config = {
  client: process.env.DB_CONNECTION,
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: 'Z',
    typeCast: function (field: any, next: () => any) {
      if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
        return moment(field.string()).format('YYYY-MM-DD HH:mm:ss')
      }
      return next()
    },
  },
  migrations: { directory: './database/migrations' },
  seeds: { directory: './database/seeders' },
}

const config: { [key: string]: Knex.Config } = {
  development: {
    ...defaultConfig,
    debug: true,
    useNullAsDefault: true,
  },

  test: {
    ...defaultConfig,
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: `${process.env.DB_DATABASE}_test`,
    },
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

  production: { ...defaultConfig },
}

export default config

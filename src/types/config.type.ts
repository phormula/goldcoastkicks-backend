export type EnvironmentConfig = {
  client?: string
  connection?: {
    host?: string
    port?: string
    user?: string
    password?: string
    database?: string
  }
  migrations?: object
  seeds?: object
  pool?: object
}

// type Config = {
//   development: EnvironmentConfig
//   test: EnvironmentConfig
//   staging: EnvironmentConfig
//   production: EnvironmentConfig
// }

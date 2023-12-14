import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import LoggerService from '@app/services/Logger.service'

const errorHandler = (err: { [key: string]: any }, req: Request, res: Response, next: NextFunction) => {
  LoggerService.logEvents(`${err.name}: ${err.message}`, 'error_log.log')
  if (process.env.NODE_ENV === 'production') {
    let message: string
    switch (err.message) {
      case 'Not authenticated!':
        message = err.message
        break
      case 'jwt expired!':
        message = 'Session expired'
        break

      default:
        message = 'Internal Server has occured'
        break
    }
    const status = err.name === 'UnauthorizedError' ? 401 : 500
    res.status(status).send({ status: 'error', message })
  } else {
    console.log(err.stack || err)
    res.status(err.status || 500).send({ status: 'error', message: err.message || err })
  }
}

export default errorHandler

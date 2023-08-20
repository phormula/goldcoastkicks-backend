import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import LoggerService from '@app/services/Logger.service'

const errorHandler = (err: { [key: string]: any }, req: Request, res: Response, next: NextFunction) => {
  LoggerService.logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
  if (process.env.NODE_ENV === 'production') {
    res.status(500).send({ status: 'error', message: 'Internal Server has occured' })
  } else {
    console.log(err.stack || err)
    res.status(err.status || 500).send({ status: 'error', message: err.message || err })
  }
}

export default errorHandler

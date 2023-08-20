import { Request, Response, NextFunction } from 'express'
import { v4 } from 'uuid'
import { existsSync } from 'fs'
import { promises as fsPromises } from 'fs'
import { join } from 'path'

export default class LoggerService {
  static async logEvents(message: string, logName: string) {
    const currentDateTime = new Date()
    const dateTime = currentDateTime.toLocaleString('en-GB', { timeZone: 'UTC' })
    const logItem = `${dateTime}\t${v4()}\t${message}\n`

    try {
      if (!existsSync(join(__dirname, '..', 'logs'))) {
        await fsPromises.mkdir(join(__dirname, '..', 'logs'))
      }

      await fsPromises.appendFile(join(__dirname, '..', 'logs', logName), logItem)
    } catch (err) {
      console.log(err)
    }
  }

  static requestlogger(req: Request, _res: Response, next: NextFunction) {
    LoggerService.logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
    console.log(`${req.method} ${req.path}`)
    next()
  }
}

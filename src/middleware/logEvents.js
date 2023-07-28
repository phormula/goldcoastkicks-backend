import { v4 } from 'uuid'
import { existsSync } from 'fs'
import { promises as fsPromises } from 'fs'
import { join } from 'path'

export const logEvents = async (message, logName) => {
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

export const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
  console.log(`${req.method} ${req.path}`)
  next()
}

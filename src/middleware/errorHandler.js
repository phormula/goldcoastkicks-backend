import 'dotenv/config'
import { logEvents } from '@app/middleware/logEvents.js'

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
  if (process.env.NODE_ENV === 'production') {
    res
      .status(500)
      .send({ status: 'error', message: 'Internal Server has occured' })
  } else {
    console.error(err.stack)
    res.status(500).send({ status: 'error', message: err.message })
  }
}

export default errorHandler

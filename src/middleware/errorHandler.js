import 'dotenv/config'
import { logEvents } from '@app/middleware/logEvents'

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
  if (process.env.NODE_ENV === 'production') {
    res
      .status(500)
      .send({ status: 'error', message: 'Internal Server has occured' })
  } else {
    console.log(err.stack || err)
    res
      .status(err.status || 500)
      .send({ status: 'error', message: err.message || err })
  }
}

export default errorHandler

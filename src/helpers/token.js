import 'dotenv/config'
import { sign, verify } from 'jsonwebtoken'

const generateToken = (data, expiresIn = '1h') => {
  const options = {
    expiresIn,
  }
  return sign(data, process.env.JWT_SECRET_KEY, options)
}

const verifyToken = (token) => verify(token, process.env.JWT_SECRET_KEY)

export default { generateToken, verifyToken }

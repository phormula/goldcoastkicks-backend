import 'dotenv/config'
import { sign, verify } from 'jsonwebtoken'

export const generateToken = (data: any, expiresIn = '1h') => {
  const options = { expiresIn }
  return sign(data, process.env.JWT_SECRET_KEY || 'qYSPNHajE6a7mLzZVNhCvYD3fQI24BX', options)
}

export const verifyToken = (token: string) =>
  verify(token, process.env.JWT_SECRET_KEY || 'qYSPNHajE6a7mLzZVNhCvYD3fQI24BX')

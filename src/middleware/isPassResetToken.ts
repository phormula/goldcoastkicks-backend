import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@app/helpers'
import User from '@model/User'
import { JwtPayload } from 'jsonwebtoken'

export async function isPassResetToken(req: Request, res: Response, next: NextFunction) {
  // Get authorization header from request
  const isPassResetToken = req.query.token || req.body.token

  if (isPassResetToken) {
    try {
      const tokenData = verifyToken(isPassResetToken) as JwtPayload
      const user = await User.query().findOne({ email: tokenData.email })

      if (!user) {
        return next({ status: 401, message: 'There is no user' })
      }

      const now = new Date()
      const exp = new Date((tokenData.exp || 1) * 1000)
      const difference = exp.getTime() - now.getTime()
      const minutes = Math.round(difference / 60000)

      if (minutes < 0) {
        return next({
          status: 401,
          message: 'Password reset token has expired',
        })
      }
      return next()
    } catch (err: any) {
      return next({ status: 401, ...err })
    }
  }

  // Go to next middleware
  return next({ status: 401, message: 'Password reset token not found' })
}

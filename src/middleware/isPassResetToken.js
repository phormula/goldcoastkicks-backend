import { tokenHelper } from '@app/helpers'
import User from '@model/User'

export default async function (req, res, next) {
  // Get authorization header from request
  const isPassResetToken = req.query.token || req.body.token

  if (isPassResetToken) {
    try {
      const tokenData = tokenHelper.verifyToken(isPassResetToken)
      const user = await User.query().findOne({ email: tokenData.email })

      if (!user) {
        return next({ status: 401, message: 'There is no user' })
      }

      const now = new Date()
      const exp = new Date(tokenData.exp * 1000)
      const difference = exp.getTime() - now.getTime()
      const minutes = Math.round(difference / 60000)

      if (minutes < 0) {
        return next({
          status: 401,
          message: 'Password reset token has expired',
        })
      }
      return next()
    } catch (err) {
      return next({ status: 401, ...err })
    }
  }

  // Go to next middleware
  return next({ status: 401, message: 'Password reset token not found' })
}

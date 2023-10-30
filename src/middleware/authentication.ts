import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@app/helpers'
import User from '@model/User'
import { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      user?: User | null
    }
  }
}

export async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  // Get authorization header from request
  const { authorization, refreshtoken: refreshToken } = req.headers
  // Firstly, set request user to null
  req.user = null

  if (authorization) {
    // Make sure the token is bearer token
    const isBearerToken = authorization.startsWith('Bearer ')

    // Decode token - verifies secret and checks exp
    if (isBearerToken) {
      const token = authorization.split(' ').at(-1) as string

      try {
        // Verify token and get token data
        const tokenData = verifyToken(token) as JwtPayload

        // Find user from database
        const user = await User.query().findById(tokenData.id).withGraphFetched('roles')
        if (!user) {
          return next({ status: 401, message: 'There is no user' })
        }

        // Set request user
        req.user = user

        // Check if the token renewal time is coming
        const now = new Date()
        const exp = new Date((tokenData.exp || 1) * 1000)
        const difference = exp.getTime() - now.getTime()
        const minutes = Math.round(difference / 60000)

        if (minutes < 15) {
          // Verify refresh token and get refresh token data
          // const refreshTokenData = await verifyToken(refreshToken)
          // Check the user of refresh token
          // if (refreshTokenData.id === tokenData.id) {
          //   // Generate new tokens
          //   const newRefreshToken = user.generateToken('2h')
          //   // Set response headers
          //   res.setHeader('RefreshToken', newRefreshToken)
          // }
          const newToken = user.generateToken(undefined)
          res.setHeader('Token', newToken)
        }
      } catch (err: any) {
        return next({ status: 401, ...err })
      }
    }
  }

  // Go to next middleware
  return next()
}

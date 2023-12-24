import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@app/helpers'
import User from '@model/User'
import { JwtPayload } from 'jsonwebtoken'
import { join } from 'path'
import csrf from 'csrf'

declare global {
  namespace Express {
    interface Request {
      user?: User | null
    }
  }
}

const Tokens = new csrf()
const secret = Tokens.secretSync()
const csrfToken = Tokens.create(secret)

export async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  let message: string
  req.user = null
  console.log(req.url, req.method)
  if (req.url === '/' && req.method === 'POST') return next()

  const token = (req.headers.authorization?.split(' ').at(-1) as string) || req.cookies.token
  if (token) {
    try {
      const tokenData = verifyToken(token) as JwtPayload

      // Find user from database
      const user = await User.query().findById(tokenData.id).whereNot({ is_disabled: 1 }).withGraphFetched('roles')
      if (!user) {
        message = 'There is no user'
        return res.format({
          html() {
            res.render(join(__dirname, '..', 'views', 'login'), {
              csrfToken,
              status: 'error',
              message,
            })
          },
          json() {
            next({ status: 401, message })
          },
        })
      }

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
        const newToken = user.generateToken('24h')
        res.setHeader('Token', newToken)
      }
      return next()
    } catch (err: any) {
      if (err.name === 'JsonWebTokenError') res.clearCookie('token')
      return res.format({
        html() {
          res.render(join(__dirname, '..', 'views', 'login'), {
            csrfToken,
            status: 'error',
            message: err.message,
          })
        },
        json() {
          next({ status: 401, ...err })
        },
      })
    }
  }
  // Go to next middleware
  return next()
}

export const checkCsrfToken = (routeSecret: string) => async (req: Request, res: Response, next: NextFunction) => {
  if (Tokens.verify(routeSecret, req.body._csrf) || Tokens.verify(secret, req.body._csrf)) {
    return next()
  }

  return res.status(500).send('invalid csrf token!')
}

import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'
import { hashSync } from 'bcrypt'
import { protectedUser, verifyToken } from '@app/helpers'
import { JwtPayload } from 'jsonwebtoken'
import User from '@model/User'
import Role from '@app/model/Role'
import Mail from '@model/Mail'
import OAuthService from '@app/services/OAuth.service'
import AuthService from '@app/services/Auth.service'

class AuthController {
  /**`
   * POST /auth/login
   * Login request
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body

      // Find user by email address
      const user = await User.query().findOne({ email }).withGraphJoined('roles(defaultSelects)')
      if (!user) {
        return res.status(400).json({ message: 'Incorrect email or password!' })
      }

      // Check user password
      const isValidPassword = await user.validatePassword(password)
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Incorrect email or password!' })
      }
      // Generate and return token
      const token = user.generateToken()
      const refreshToken = user.generateToken('2h')
      return res.status(200).json({ data: { token, refreshToken, ...protectedUser(user) } })
    } catch (err) {
      return next(err)
    }
  }

  async loginByOauth(req: Request, res: Response, next: NextFunction) {
    try {
      // User is authenticated, you can generate an access token here
      const { id_token } = req.body
      const oAuthUser = await OAuthService.verifyGoogleToken(id_token)

      if (oAuthUser) {
        const user = await User.query().findOne({ email: oAuthUser.email }).withGraphJoined('roles(defaultSelects)')
        if (!user) {
          const userData = {
            first_name: oAuthUser.given_name,
            last_name: oAuthUser.family_name,
            email: oAuthUser.email,
            role: 'customer',
          }

          const user = await AuthService.register(userData)

          return res.status(201).json({ data: user })
        }

        // Generate and return token
        const userToken = user.generateToken()
        const refreshToken = user.generateToken('2h')
        return res.status(200).json({ data: { token: userToken, refreshToken, ...protectedUser(user) } })
      }

      return res.status(500).json({ data: { status: 'error', message: oAuthUser } })
    } catch (err) {
      return next(err)
    }
  }

  /**`
   * POST /auth/resetpass
   * Reset Password request
   */
  async resetPassRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body

      const result = await AuthService.resetPassRequest(email)

      if (result.status === 'error') {
        return res.status(404).json(result)
      }

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }

  /**`
   * POST /auth/resetpass
   * Reset Password request
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { newPassword, confirmPassword, token } = req.body
      const tokenData = verifyToken(token) as JwtPayload
      console.log(req.body)
      if (newPassword !== confirmPassword) {
        return next(createHttpError(400, 'Passwords do not match'))
      }

      const updateUser = await User.query()
        .update({ password: hashSync(newPassword, Number(process.env.SALT)) })
        .where('id', tokenData.id)
      const user = await User.query().findById(tokenData.id)
      console.log(updateUser)
      console.log(user)
      if (!updateUser) {
        return next(createHttpError(400, 'There is no user with this email address!'))
      }

      if (user) {
        await user.sendMail({
          subject: 'Password Reset Successful',
          text: `Your password has been succesfully reset.`,
          html: `<p>Your password has been succesfully reset</p>`,
        })
      }
      return res.status(200).json({ success: true, message: 'password reset successful' })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * POST /auth/register
   * Register request
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { first_name, last_name, email, password } = req.body
      const roleName = req.body.role || 'customer'
      const data = {
        first_name,
        last_name,
        email,
        password: hashSync(password, Number(process.env.SALT)),
        role: roleName,
      }

      const registeredUser = await AuthService.register(data)

      return res.status(201).json({ data: registeredUser })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * GET /auth/me
   * Get current user
   */
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(protectedUser(req.user as { [key: string]: any }))
    } catch (err) {
      return next(err)
    }
  }

  /**
   * PUT /auth/me
   * Update current user
   */
  async updateCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        req.user = await User.query().updateAndFetchById((req.user as User).id, {
          ...req.body,
        })
      }

      res.status(200).json({ success: true })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * DELETE /auth/me
   * Delete current user
   */
  async deleteCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      await (req.user as User).destroy()
      res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  /**
   * PUT /auth/me/password
   * Update password of current user
   */
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { current, password } = req.body
      const user = req.user as User
      // Check user password
      const isValidPassword = await user.validatePassword(current)
      if (!isValidPassword) {
        return next(createHttpError(400, 'Incorrect password!'))
      }

      // Update password
      user.password = password
      await user.save()

      return res.json({ success: true })
    } catch (err) {
      return next(err)
    }
  }
  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await Role.query().select()

      res.status(200).json({ data: roles })

      return roles
    } catch (err) {
      return next(err)
    }
  }
}

export default new AuthController()

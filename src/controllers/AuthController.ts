import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import { hashSync } from 'bcryptjs'
import { JwtPayload } from 'jsonwebtoken'
import { protectedUser, verifyToken } from '@app/helpers'
import User from '@model/User'
import Role from '@model/Role'
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
      const { email, password, is_mobile } = req.body

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
      const expires = is_mobile ? undefined : '24h'
      const token = user.generateToken(expires)
      const refreshToken = user.generateToken(expires)
      return res.status(200).json({ data: { token, refreshToken, ...protectedUser(user) } })
    } catch (err) {
      return next(err)
    }
  }

  async loginByOauth(req: Request, res: Response, next: NextFunction) {
    try {
      // User is authenticated, you can generate an access token here
      const { id_token, is_mobile } = req.body
      const oAuthUser = await OAuthService.verifyGoogleToken(id_token)

      if (oAuthUser) {
        const user = await User.query().findOne({ email: oAuthUser.email }).withGraphJoined('roles(defaultSelects)')
        if (!user) {
          const userData = {
            first_name: oAuthUser.given_name,
            last_name: oAuthUser.family_name,
            email: oAuthUser.email,
            role: 'customer',
            is_mobile,
          }

          const user = await AuthService.register(userData)

          return res.status(201).json({ data: user })
        }

        // Generate and return token
        const expires = is_mobile ? undefined : '24h'
        const userToken = user.generateToken(expires)
        const refreshToken = user.generateToken(expires)
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
        return res.status(400).json({ status: 'error', message: 'Passwords do not match' })
      }

      const updateUser = await User.query()
        .update({ password: hashSync(newPassword, Number(process.env.SALT)) })
        .where('id', tokenData.id)
      const user = await User.query().findById(tokenData.id)
      // console.log(updateUser)
      // console.log(user)
      if (!updateUser) {
        return res.status(400).json({ status: 'error', message: 'There is no user with this email address!' })
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
      const { first_name, last_name, email, password, is_mobile } = req.body
      const roleName = req.body.role || 'customer'
      const data = {
        first_name,
        last_name,
        email,
        password: hashSync(password, Number(process.env.SALT)),
        role: roleName,
        is_mobile,
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

      return res.status(200).json({ success: true })
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

      return res.status(204).send()
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
        return res.status(400).json({ status: 'error', message: 'Incorrect password!' })
      }

      // Update password
      user.password = hashSync(password, Number(process.env.SALT))
      await user.save()

      return res.status(200).json({ success: true })
    } catch (err) {
      return next(err)
    }
  }
  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await Role.query().select()

      return res.status(200).json({ data: roles })
    } catch (err) {
      return next(err)
    }
  }
}

export default new AuthController()

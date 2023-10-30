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

class AuthService {
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
      const refreshToken = user.generateToken('2h')
      return res.status(200).json({ token, refreshToken, ...protectedUser(user) })
    } catch (err) {
      return next(err)
    }
  }

  async resetPassRequest(email: string) {
    try {
      // Find user by email address
      const user = await User.query().findOne({ email }).withGraphJoined('roles(defaultSelects)')
      if (!user) {
        return { status: 'error', message: 'There is no user with this email address!' }
      }

      // Generate and return token
      const token = user.generateToken('0.5h')
      const resetLink = `${process.env.APP_URL}/auth/resetpass?token=${token}`
      await user.sendMail({
        subject: 'Password Reset Request',
        text: `Hello ${user.first_name}, You have requested a password reset. 
         click on the link below to reset your password.\n\n
         ${resetLink}
         \n\n
         If you did not make this request please ignore this email.`,
        html: `<h3>Hello ${user.first_name},</h3>
         <p>You have requested a password reset.</p>
         <p>click on the link below to reset your password.</p><br/>
         <p>${resetLink}</p><br/>
         <p>If you did not make this request please ignore this email.</p>`,
      })

      return { status: 'success', message: 'password reset email sent' }
    } catch (err: any) {
      return err
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

  async register(data: any) {
    try {
      const role = await Role.query().select('id').findOne({ name: data.role })
      const user = await User.query().insertGraph(
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
          roles: [role],
        },
        {
          relate: ['roles'],
        },
      )
      const expires = data.is_mobile ? undefined : '24h'
      const registeredUser = await User.query().findById(user.id)
      const token = registeredUser?.generateToken(expires)

      const mailTemplate = await Mail.query().select('subject', 'text', 'html').findOne({ type: 'register' })
      await registeredUser?.sendMail(mailTemplate)

      return { token, ...protectedUser(registeredUser as { [key: string]: any }) }
    } catch (err: any) {
      return err
    }
  }

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

export default new AuthService()

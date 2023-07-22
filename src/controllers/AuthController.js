import 'dotenv/config'
import createHttpError from 'http-errors'
import { hashSync } from 'bcrypt'
import { query } from '@model/User'
import { query as _query } from '@model/Role'
import { query as __query } from '@model/Mail'
import { protectedUser, tokenHelper } from '@app/helpers'

class AuthController {
  /**`
   * POST /auth/login
   * Login request
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body

      // Find user by email address
      const user = await query()
        .findOne({ email })
        .withGraphJoined('roles(defaultSelects)')
      if (!user) {
        return next(
          createHttpError(400, 'There is no user with this email address!'),
        )
      }

      // Check user password
      const isValidPassword = await user.validatePassword(password)
      if (!isValidPassword) {
        return next(createHttpError(400, 'Incorrect password!'))
      }
      // Generate and return token
      const token = user.generateToken()
      const refreshToken = user.generateToken('2h')
      return res
        .status(200)
        .json({ token, refreshToken, ...protectedUser(user) })
    } catch (err) {
      return next(err)
    }
  }

  /**`
   * POST /auth/resetpass
   * Reset Password request
   */
  async resetPassRequest(req, res, next) {
    try {
      const { email } = req.body

      // Find user by email address
      const user = await query()
        .findOne({ email })
        .withGraphJoined('roles(defaultSelects)')
      if (!user) {
        return next(
          createHttpError(400, 'There is no user with this email address!'),
        )
      }

      // Generate and return token
      const token = user.generateToken('0.5h', 'reset')
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
      return res
        .status(200)
        .json({ success: true, message: 'password reset email sent' })
    } catch (err) {
      return next(err)
    }
  }

  /**`
   * POST /auth/resetpass
   * Reset Password request
   */
  async resetPassword(req, res, next) {
    try {
      const { newPassword, confirmPassword, token } = req.body
      const tokenData = tokenHelper.verifyToken(token)
      console.log(req.body)
      if (newPassword !== confirmPassword) {
        return next(createHttpError(400, 'Passwords do not match'))
      }

      const updateUser = await query()
        .update({ password: hashSync(newPassword, Number(process.env.SALT)) })
        .where('id', tokenData.id)
      const user = await query().findById(tokenData.id)
      console.log(updateUser)
      console.log(user)
      if (!updateUser) {
        return next(
          createHttpError(400, 'There is no user with this email address!'),
        )
      }

      await user.sendMail({
        subject: 'Password Reset Successful',
        text: `Your password has been succesfully reset.`,
        html: `<p>Your password has been succesfully reset</p>`,
      })
      return res
        .status(200)
        .json({ success: true, message: 'password reset successful' })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * POST /auth/register
   * Register request
   */
  async register(req, res, next) {
    try {
      const { first_name, last_name, email, password } = req.body
      const roleName = req.body.role || 'customer'
      const role = await _query().select('id').findOne({ name: roleName })
      const user = await query().insertGraph(
        [
          {
            first_name,
            last_name,
            email,
            password: hashSync(password, Number(process.env.SALT)),
            roles: [role],
          },
        ],
        {
          relate: ['roles'],
        },
      )

      const registeredUser = await query().findById(user[0].id)

      // Generate and return tokens
      const token = registeredUser.generateToken()
      const refreshToken = registeredUser.generateToken('2h')

      const mailTemplate = await __query()
        .select('subject', 'text', 'html')
        .findOne({ type: 'register' })
      await registeredUser.sendMail(mailTemplate)

      if (roleName !== 'vendor') {
        res
          .status(201)
          .json({ token, refreshToken, ...protectedUser(registeredUser) })
      }

      return [token, refreshToken, registeredUser]
    } catch (err) {
      next(err)
    }
  }

  /**
   * GET /auth/me
   * Get current user
   */
  async getCurrentUser(req, res, next) {
    try {
      res.json(protectedUser(req.user))
    } catch (err) {
      next(err)
    }
  }

  /**
   * PUT /auth/me
   * Update current user
   */
  async updateCurrentUser(req, res, next) {
    try {
      req.user = await query().updateAndFetchById(req.user.id, { ...req.body })

      res.status(200).json({ success: true })
    } catch (err) {
      next(err)
    }
  }

  /**
   * DELETE /auth/me
   * Delete current user
   */
  async deleteCurrentUser(req, res, next) {
    try {
      await req.user.destroy()
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }

  /**
   * PUT /auth/me/password
   * Update password of current user
   */
  async updatePassword(req, res, next) {
    try {
      const { current, password } = req.body

      // Check user password
      const isValidPassword = await req.user.validatePassword(current)
      if (!isValidPassword) {
        return next(createHttpError(400, 'Incorrect password!'))
      }

      // Update password
      req.user.password = password
      await req.user.save()

      return res.json({ success: true })
    } catch (err) {
      return next(err)
    }
  }
}

export default new AuthController()

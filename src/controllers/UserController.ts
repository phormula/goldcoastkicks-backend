import { Request, Response, NextFunction } from 'express'
import { protectedUser } from '@app/helpers'
import User from '@model/User'
import Mail from '@model/Mail'
import Role from '@model/Role'

class UserController {
  async getAllUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.query().withGraphJoined('roles(defaultSelects)')
      const result = users.map((u) => protectedUser(u))

      return res.send({ data: result })
    } catch (err) {
      return next(err)
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await User.query().alias('roles').findById(req.params.id).withGraphFetched('roles(defaultSelects)')

      if (result) {
        return res.send(protectedUser(result))
      }

      return res.status(404).json({ status: 'error', message: 'User not found' })
    } catch (err) {
      return next(err)
    }
  }

  async getUserRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await Role.query().select('*')

      return res.status(200).send(roles)
    } catch (err) {
      return next(err)
    }
  }

  async getMailTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const mailTemplate = await Mail.query().select('*')

      return res.status(200).send(mailTemplate)
    } catch (err) {
      return next(err)
    }
  }
}

export default new UserController()

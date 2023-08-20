import { Request, Response, NextFunction } from 'express'
import User from '@model/User'
import Role from '@app/model/Role'
import Mail from '@model/Mail'
import { protectedUser } from '@app/helpers'

class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.query().withGraphJoined('roles(defaultSelects)')
      const result = users.map((u) => protectedUser(u))
      res.send({ data: result })
    } catch (err) {
      return next(err)
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await User.query().alias('roles').findById(req.params.id).withGraphFetched('roles(defaultSelects)')

      if (result) {
        res.send(protectedUser(result))
      } else {
        res.send({ status: 'error', message: 'User not found' })
      }
    } catch (err) {
      return next(err)
    }
  }

  async getUserRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await Role.query()
      res.send(roles)
    } catch (err) {
      return next(err)
    }
  }

  async getMailTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const mailTemplate = await Mail.query()
      console.log('template sent', mailTemplate)
      res.send(mailTemplate)
    } catch (err) {
      console.log('template error')
      return next(err)
    }
  }
}

export default new UserController()

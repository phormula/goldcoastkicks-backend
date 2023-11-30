import { Request, Response, NextFunction } from 'express'
import UserService from '@app/services/User.service'

class UserController {
  async getAllUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers()

      return res.send(users)
    } catch (err) {
      return next(err)
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUser(req.params.id)
      const statusCode = user?.data?.status === 'error' ? 404 : 200

      return res.status(statusCode).json(user)
    } catch (err) {
      return next(err)
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body)

      return res.status(200).json(user)
    } catch (err) {
      return next(err)
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.deleteUser(req.params.id)

      return res.status(200).json(user)
    } catch (err) {
      return next(err)
    }
  }

  async getUserRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await UserService.getUserRoles()

      return res.status(200).send(roles)
    } catch (err) {
      return next(err)
    }
  }

  async getMailTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const mailTemplate = await UserService.getMailTemplates()

      return res.status(200).send(mailTemplate)
    } catch (err) {
      return next(err)
    }
  }

  async getAllUserAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const addresses = await UserService.getAllUserAddress(Number(req.query.user_id))

      return res.send(addresses)
    } catch (error) {
      return next(error)
    }
  }

  async getUserAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userAddress = await UserService.getUserAddress(Number(req.params.id))
      const statusCode = userAddress.data.status === 'error' ? 404 : 200

      return res.status(statusCode).json(userAddress)
    } catch (error) {
      return next(error)
    }
  }

  async createUserAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userAddress = await UserService.createUserAddress(req.body)

      return res.status(201).json(userAddress)
    } catch (error) {
      return next(error)
    }
  }
  // TODO only delete only what you own
  async updateUserAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userAddress = await UserService.updateUserAddress(req.params.id, req.body)

      return res.status(200).json(userAddress)
    } catch (error) {
      return next(error)
    }
  }

  async deleteUserAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userAddress = await UserService.deleteUserAddress(req.params.id)

      return res.status(200).json(userAddress)
    } catch (error) {
      return next(error)
    }
  }
}

export default new UserController()

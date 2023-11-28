import { Request, Response, NextFunction } from 'express'
import Type from '@model/Type'

class TypeController {
  async getAllTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const types = await Type.query()

      return res.send({ data: types })
    } catch (error) {
      return next(error)
    }
  }

  async getType(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await Type.query().findById(req.params.id)

      if (result) {
        return res.send({ data: result })
      }

      return res.status(404).json({ status: 'error', message: 'Type not found' })
    } catch (error) {
      return next(error)
    }
  }

  async createType(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body

      const type = await Type.query().insert({ name, description })

      return res.status(201).json({ data: type })
    } catch (error) {
      return next(error)
    }
  }

  async updateType(req: Request, res: Response, next: NextFunction) {
    try {
      const typeId = req.params.id
      const { name, description } = req.body
      const type = await Type.query().update({ name, description }).where({ id: typeId })

      return res.status(200).json({ data: type })
    } catch (error) {
      return next(error)
    }
  }

  async deleteType(req: Request, res: Response, next: NextFunction) {
    try {
      const typeId = req.params.id
      await Type.query().findById(typeId).delete()

      return res.status(200).json({ data: { status: 'success', message: 'Type deleted successfully' } })
    } catch (error) {
      return next(error)
    }
  }
}

export default new TypeController()

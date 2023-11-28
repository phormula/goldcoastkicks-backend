import { Request, Response, NextFunction } from 'express'
import Size from '@model/Size'

class SizeController {
  async getAllSizes(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await Size.query()

      return res.send({ data: brands })
    } catch (error) {
      return next(error)
    }
  }

  async getSize(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await Size.query().findById(req.params.id)

      if (result) {
        return res.send({ data: result })
      }

      return res.status(404).json({ status: 'error', message: 'Size not found' })
    } catch (error) {
      return next(error)
    }
  }

  async createSize(req: Request, res: Response, next: NextFunction) {
    try {
      const { size_name, origin_country } = req.body

      const size = await Size.query().insert({ size_name, origin_country })

      return res.status(201).json({ data: size })
    } catch (error) {
      return next(error)
    }
  }

  async updateSize(req: Request, res: Response, next: NextFunction) {
    try {
      const sizeId = req.params.id
      const { size_name, origin_country } = req.body
      const size = await Size.query().update({ size_name, origin_country }).where({ id: sizeId })

      return res.status(200).json({ data: size })
    } catch (error) {
      return next(error)
    }
  }

  async deleteSize(req: Request, res: Response, next: NextFunction) {
    try {
      const sizeId = req.params.id
      await Size.query().findById(sizeId).delete()

      return res.status(200).json({ data: { status: 'success', message: 'Size deleted successfully' } })
    } catch (error) {
      return next(error)
    }
  }
}

export default new SizeController()

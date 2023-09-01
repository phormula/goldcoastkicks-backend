import { Request, Response, NextFunction } from 'express'
import Colorway from '@app/model/Colorway'
import createHttpError from 'http-errors'

class ColorwayController {
  async getAllColorways(req: Request, res: Response, next: NextFunction) {
    try {
      const colorways = await Colorway.query()

      return res.send({ data: colorways })
    } catch (error) {
      return next(error)
    }
  }

  async getColorway(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await Colorway.query().findById(req.params.id)

      if (result) return res.send({ data: result })

      return next(createHttpError(404, 'Colorway not found'))
    } catch (error) {
      return next(error)
    }
  }

  async createColorway(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body

      const colorway = await Colorway.query().insert({ name, description })

      return res.status(201).json({ data: colorway })
    } catch (error) {
      return next(error)
    }
  }

  async updateColorway(req: Request, res: Response, next: NextFunction) {
    try {
      const colorwayId = req.params.id
      const { name, description } = req.body
      const colorway = await Colorway.query().update({ name, description }).where({ id: colorwayId })

      return res.status(200).json({ data: colorway })
    } catch (error) {
      return next(error)
    }
  }

  async deleteColorway(req: Request, res: Response, next: NextFunction) {
    try {
      const colorwayId = req.params.id
      await Colorway.query().findById(colorwayId).delete()

      return res.status(200).json({ data: { status: 'success', message: 'Colorway deleted successfully' } })
    } catch (error) {
      return next(error)
    }
  }
}

export default new ColorwayController()

import { Request, Response, NextFunction } from 'express'
import Colorway from '@model/Colorway'

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

      return res.status(404).json({ status: 'error', message: 'Court not found' })
    } catch (error) {
      return next(error)
    }
  }

  async createColorway(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, color_code, darkness, description } = req.body
      let color = await Colorway.query().findOne({ color_code })

      if (!color) {
        color = await Colorway.query().insert({ name, color_code, darkness, description })
      }

      return res.status(201).json({ data: color })
    } catch (error) {
      return next(error)
    }
  }

  async createBulkColorway(req: Request, res: Response, next: NextFunction) {
    const { colors } = req.body
    const colorways: Colorway[] = []

    try {
      for (const color of colors) {
        let result = await Colorway.query().findOne({ color_code: color.color_code })

        if (!result) {
          result = await Colorway.query().insert(color)
        }
        if (!colorways.some((c) => c.id === result?.id)) colorways.push(result)
      }
      return res.status(201).json({ data: colorways })
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

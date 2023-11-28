import { Request, Response, NextFunction } from 'express'
import Court from '@model/Court'

class CourtController {
  async getAllCourts(req: Request, res: Response, next: NextFunction) {
    try {
      const courts = await Court.query()

      return res.send({ data: courts })
    } catch (error) {
      return next(error)
    }
  }

  async getCourt(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await Court.query().findById(req.params.id)

      if (result) {
        return res.send({ data: result })
      }

      return res.status(404).json({ status: 'error', message: 'Court not found' })
    } catch (error) {
      return next(error)
    }
  }

  async createCourt(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body

      const court = await Court.query().insert({ name, description })

      return res.status(201).json({ data: court })
    } catch (error) {
      return next(error)
    }
  }

  async updateCourt(req: Request, res: Response, next: NextFunction) {
    try {
      const courtId = req.params.id
      const { name, description } = req.body
      const court = await Court.query().update({ name, description }).where({ id: courtId })

      return res.status(200).json({ data: court })
    } catch (error) {
      return next(error)
    }
  }

  async deleteCourt(req: Request, res: Response, next: NextFunction) {
    try {
      const courtId = req.params.id
      await Court.query().findById(courtId).delete()

      return res.status(200).json({ data: { status: 'success', message: 'Court deleted successfully' } })
    } catch (error) {
      return next(error)
    }
  }
}

export default new CourtController()

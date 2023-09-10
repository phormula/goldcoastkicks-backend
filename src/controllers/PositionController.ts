import { Request, Response, NextFunction } from 'express'
import Position from '@app/model/Position'
import createHttpError from 'http-errors'

class PositionController {
  async getAllPositions(req: Request, res: Response, next: NextFunction) {
    try {
      const positions = await Position.query()

      return res.send({ data: positions })
    } catch (error) {
      return next(error)
    }
  }

  async getPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await Position.query().findById(req.params.id)

      if (result) {
        return res.send({ data: result })
      }

      return next(createHttpError(404, 'Position not found'))
    } catch (error) {
      return next(error)
    }
  }

  async createPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body

      const position = await Position.query().insert({ name, description })

      return res.status(201).json({ data: position })
    } catch (error) {
      return next(error)
    }
  }

  async updatePosition(req: Request, res: Response, next: NextFunction) {
    try {
      const positionId = req.params.id
      const { name, description } = req.body
      const position = await Position.query().update({ name, description }).where({ id: positionId })

      return res.status(200).json({ data: position })
    } catch (error) {
      return next(error)
    }
  }

  async deletePosition(req: Request, res: Response, next: NextFunction) {
    try {
      const positionId = req.params.id
      await Position.query().findById(positionId).delete()

      return res.status(200).json({ data: { status: 'success', message: 'Position deleted successfully' } })
    } catch (error) {
      return next(error)
    }
  }
}

export default new PositionController()

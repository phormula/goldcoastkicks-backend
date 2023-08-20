import { Request, Response, NextFunction } from 'express'
import Colorway from '@app/model/Colorway'

class ColorwayController {
  async getAllColorways(req: Request, res: Response, next: NextFunction) {
    try {
      const colorways = await Colorway.query()

      res.send({ data: colorways })
    } catch (err) {
      return next(err)
    }
  }

  async getColorway(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await Colorway.query().findById(req.params.id)

      if (result) {
        res.send({ data: result })
      } else {
        res.status(404).send({ status: 'error', message: 'Colorway not found' })
      }
    } catch (err) {
      return next(err)
    }
  }

  async createColorway(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body

      const colorway = await Colorway.query().insert({ name, description })
      res.status(201).json({ data: colorway })

      return colorway
    } catch (err) {
      next(err)
    }
  }

  updateColorway(req: Request, res: Response, next: NextFunction) {
    // Update a product in the database based on the data from the request body
    const colorwayId = req.params.id
    // Colorway.query().findByIdAndUpdate(productId, req.body, { new: true }, (err, product) => {
    //   if (err) {
    //     res.status(500).json({ error: 'An error occurred while updating the product.' })
    //   } else {
    //     res.json(product)
    //   }
    // })
  }

  deleteColorway(req: Request, res: Response, next: NextFunction) {
    // Delete a product from the database based on its ID
    const colorwayId = req.params.id
    // Colorway.findByIdAndDelete(productId, (err) => {
    //   if (err) {
    //     res.status(500).json({ error: 'An error occurred while deleting the product.' })
    //   } else {
    //     res.json({ message: 'Colorway deleted successfully.' })
    //   }
    // })
  }
}

export default new ColorwayController()

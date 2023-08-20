import { Request, Response, NextFunction } from 'express'
import Size from '@app/model/Size'

class SizeController {
  async getAllSizes(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await Size.query()
      res.send({ data: brands })
    } catch (err) {
      return next(err)
    }
  }

  async getSize(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await Size.query().findById(req.params.id)

      if (result) {
        res.send({ data: result })
      } else {
        res.status(404).send({ status: 'error', message: 'Size not found' })
      }
    } catch (err) {
      return next(err)
    }
  }

  async createSize(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body

      const size = await Size.query().insert({ name, description })
      res.status(201).json({ data: size })

      return size
    } catch (err) {
      next(err)
    }
  }

  updateSize(req: Request, res: Response, next: NextFunction) {
    // Update a product in the database based on the data from the request body
    const brandId = req.params.id
    // Size.findByIdAndUpdate(productId, req.body, { new: true }, (err, product) => {
    //   if (err) {
    //     res.status(500).json({ error: 'An error occurred while updating the product.' })
    //   } else {
    //     res.json(product)
    //   }
    // })
  }

  deleteSize(req: Request, res: Response, next: NextFunction) {
    // Delete a product from the database based on its ID
    const brandId = req.params.id
    // Size.findByIdAndDelete(productId, (err) => {
    //   if (err) {
    //     res.status(500).json({ error: 'An error occurred while deleting the product.' })
    //   } else {
    //     res.json({ message: 'Size deleted successfully.' })
    //   }
    // })
  }
}

export default new SizeController()

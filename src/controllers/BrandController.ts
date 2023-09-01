import { Request, Response, NextFunction } from 'express'
import Brand from '@app/model/Brand'
import createHttpError from 'http-errors'

class BrandController {
  async getAllBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await Brand.query()

      return res.send({ data: brands })
    } catch (err) {
      return next(err)
    }
  }

  async getBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await Brand.query().findById(req.params.id)

      if (result) {
        return res.send({ data: result })
      }

      return next(createHttpError(404, 'Brand not found'))
    } catch (err) {
      return next(err)
    }
  }

  async createBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body
      const brand = await Brand.query().insert({ name, description })

      return res.status(201).json({ data: brand })
    } catch (err) {
      return next(err)
    }
  }

  async updateBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const brandId = req.params.id
      const { name, description } = req.body
      const brand = await Brand.query().update({ name, description }).where({ id: brandId })

      return res.status(200).json({ data: brand })
    } catch (error) {
      return next(error)
    }
  }

  async deleteBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const brandId = req.params.id
      await Brand.query().findById(brandId).delete()

      return res.status(200).json({ data: { status: 'success', message: 'Brand deleted successfully' } })
    } catch (error) {
      return next(error)
    }
  }
}

export default new BrandController()

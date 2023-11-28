import { Request, Response, NextFunction } from 'express'
import Brand from '@model/Brand'

class BrandController {
  async getAllBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`
      const brands = await Brand.query()
      const brandData = brands.map((brand) => {
        const image = brand.image ? { image: `${baseUrl}/file/image/${brand.image}` } : {}
        return { ...brand, ...image }
      })

      return res.send({ data: brandData })
    } catch (err) {
      return next(err)
    }
  }

  async getBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`
      const result = await Brand.query().findById(req.params.id)

      if (result) {
        return res.send({ data: { ...result, image: `${baseUrl}/file/image/${result.image}` } })
      }

      return res.status(404).json({ status: 'error', message: 'Brand not found' })
    } catch (err) {
      return next(err)
    }
  }

  async createBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body
      const image = req.file?.path.split('/').at(-1)
      const brand = await Brand.query().insert({ name, description, image })

      return res.status(201).json({ data: brand })
    } catch (err) {
      return next(err)
    }
  }

  async updateBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const brandId = req.params.id
      const { name, description } = req.body
      const image = req.file?.path.split('/').at(-1)
      const brand = await Brand.query().update({ name, description, image }).where({ id: brandId })

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

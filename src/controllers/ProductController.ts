import { Request, Response, NextFunction } from 'express'
import ProductService from '@app/services/Product.service'

class ProductController {
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`
      const result = await ProductService.getAllProducts(req.query, baseUrl)

      return res.send(result)
    } catch (err) {
      return next(err)
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`
      const product = await ProductService.getProduct(req.params.id, baseUrl)

      if (product.status === 'error') {
        return res.status(404).send(product)
      }

      return res.status(200).send(product)
    } catch (err) {
      return next(err)
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body, req.file)

      return res.status(201).json(product)
    } catch (err) {
      next(err)
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id
      const updateProduct = await ProductService.updateProduct(productId, req.body, req.file)

      return res.status(200).json({ data: { ...updateProduct } })
    } catch (err) {
      next(err)
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.deleteProduct(req.params.id)

      if (product.data.status === 'error') {
        return res.status(400).json(product)
      }

      return res.status(200).json(product)
    } catch (err) {
      next(err)
    }
  }

  async createProductGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body
      const files = req.files as Express.Multer.File[]
      const result = await ProductService.createProductGallery(productId, files)

      if (result.data.status === 'error') {
        return res.status(400).json(result)
      }

      return res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  }

  async updateProductGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body
      const files = req.files as Express.Multer.File[]
      const result = await ProductService.updateProductGallery(productId, files)

      if (result.data.status === 'error') {
        return res.status(400).json(result)
      }

      return res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }

  async prefilters(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.prefilters()

      return res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }
}

export default new ProductController()

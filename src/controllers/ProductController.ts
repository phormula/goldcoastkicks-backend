import { Request, Response, NextFunction } from 'express'
import Product from '@app/model/Product'
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
      const {
        name,
        description,
        sku,
        sizes,
        selling_price,
        buying_currency_id,
        selling_currency_id,
        brand,
        colorways,
      } = req.body
      const image = req.file && req.file.path.split('/').at(-1)
      const updateProduct = await Product.query().upsertGraph(
        {
          id: productId,
          name,
          description,
          sku,
          ...(image && { image }),
          selling_price,
          buying_currency: buying_currency_id,
          selling_currency: selling_currency_id,
          sizes: sizes.map((s: any) => ({ id: s })),
          colorways: colorways.map((c: any) => ({ id: c })),
          brand: [{ id: brand }],
        },
        {
          relate: true,
          unrelate: true,
        },
      )

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

  async prefilters(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.prefilters()

      // if (result.data.status === 'error') {
      //   return res.status(400).json(result)
      // }

      return res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }
}

export default new ProductController()

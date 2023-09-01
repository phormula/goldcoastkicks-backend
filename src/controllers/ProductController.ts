import { Request, Response, NextFunction } from 'express'
import Product from '@app/model/Product'
import db from '@app/database/knexdb'
import createHttpError from 'http-errors'

class ProductController {
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { brand } = req.query
      const baseUrl = `${req.protocol}://${req.get('host')}`

      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 15
      const offset = (page - 1) * limit

      let productQuery = Product.query()
        .select(
          'products.*',
          'brand.name as brand',
          'selling_currency.symbol as currency_symbol',
          'selling_currency.code as currency_code',
        )
        .leftJoinRelated('brand')
        .leftJoinRelated('selling_currency')
        .limit(limit)
        .offset(offset)

      let countQuery = Product.query()

      if (brand) {
        productQuery = productQuery.where('brand.id', Number(brand))
        countQuery = countQuery.where('brand_id', Number(brand))
      }

      const totalProducts = (await countQuery.count('id').first()) as { [key: string]: any }
      const products = await productQuery
      const productData = products.map((product) => {
        const image = { image: `${baseUrl}/file/image/${product.image}` }
        return { ...product, ...image }
      })

      return res.send({
        data: productData,
        current_page: page,
        per_page: limit,
        total: totalProducts['count(`id`)'],
        last_page: Math.ceil(totalProducts['count(`id`)'] / limit),
      })
    } catch (err) {
      return next(err)
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`
      const product = await Product.query()
        .findById(req.params.id)
        .withGraphFetched(
          '[sizes(defaultSelects),gallery,colorways(default),brand(default),selling_currency,selling_currency]',
        )

      if (product) {
        product.gallery = product.gallery.map((g) => ({ ...g, image: `${baseUrl}/file/image/${g.image}` }))

        return res.status(200).send({ data: { ...product, image: `${baseUrl}/file/image/${product.image}` } })
      }

      return res.status(404).send({ status: 'error', message: 'Product not found' })
    } catch (err) {
      return next(err)
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
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
      const image = req.file?.path.split('/').at(-1)
      const product = await Product.query().insertGraph(
        [
          {
            name,
            description,
            sku,
            image,
            selling_price,
            sizes: sizes.map((s: any) => ({ id: s })),
            colorways: colorways.map((c: any) => ({ id: c })),
            buying_currency: { id: buying_currency_id },
            selling_currency: { id: selling_currency_id },
            ...(brand ? { brand: [{ id: brand }] } : {}),
          },
        ],
        {
          relate: ['sizes', 'colorways', 'buying_currency', 'selling_currency', ...(brand ? ['brand'] : [])],
        },
      )

      return res.status(201).json({ data: { ...product[0] } })
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
      const productId = req.params.id
      const product = await Product.query().findById(productId)

      if (product) {
        await product.$relatedQuery('sizes').unrelate()
        await product.$relatedQuery('colorways').unrelate()
        await product.$query().delete()

        return res.status(200).json({ data: { status: 'success', message: 'Product deleted successfully' } })
      }

      return next(createHttpError(400, 'Error deleting product!'))
    } catch (err) {
      next(err)
    }
  }

  async createProductGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body

      if (req.files) {
        const images = (req.files as Express.Multer.File[]).map((file: Express.Multer.File) => {
          return { product_id: Number(productId), image: file.path.split('/').at(-1) }
        })

        await db('product_gallery').insert(images, ['image'])

        return res.status(201).json({ data: { success: true } })
      }

      return next(createHttpError(400, 'Error adding product gallery!'))
    } catch (err) {
      next(err)
    }
  }
}

export default new ProductController()

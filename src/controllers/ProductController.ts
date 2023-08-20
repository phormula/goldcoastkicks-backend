import { Request, Response, NextFunction } from 'express'
import Product from '@app/model/Product'
import Size from '@app/model/Size'
import db from '@app/database/knexdb'

class ProductController {
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { brand } = req.query
      const baseUrl = `${req.protocol}://${req.get('host')}`

      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 15
      const offset = (page - 1) * limit

      let productQuery = Product.query()
        .select('products.*', 'brand.name as brand', 'colorway.name as color')
        .leftJoinRelated('brand')
        .leftJoinRelated('colorway')
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

      res.send({
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
        .withGraphFetched('[sizes(defaultSelects), gallery, colorway, brand]')

      if (product) {
        product.gallery = product.gallery.map((g) => ({ ...g, image: `${baseUrl}/file/image/${g.image}` }))
        res.send({
          data: { ...product, image: `${baseUrl}/file/image/${product.image}` },
        })
      } else {
        res.status(404).send({ status: 'error', message: 'Product not found' })
      }
    } catch (err) {
      return next(err)
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, sku, sizes, price, brand, colorway } = req.body

      const image = req.file?.path.split('/').at(-1)

      const productSizes = await Size.query().findByIds(sizes)
      const product = await Product.query().insertGraph(
        [
          {
            name,
            description,
            sku,
            image,
            price,
            sizes: [...productSizes],
            ...(brand ? { brand: [{ id: brand }] } : {}),
            ...(colorway ? { colorway: [{ id: colorway }] } : {}),
          },
        ],
        {
          relate: ['sizes', ...(brand ? ['brand'] : []), ...(colorway ? ['colorway'] : [])],
        },
      )
      res.status(201).json({ data: { ...product[0] } })

      return product
    } catch (err) {
      next(err)
    }
  }

  updateProduct(req: Request, res: Response, next: NextFunction) {
    // Update a product in the database based on the data from the request body
    const productId = req.params.id
    // Product.query().findByIdAndUpdate(productId, req.body, { new: true }, (err, product) => {
    //   if (err) {
    //     res.status(500).json({ error: 'An error occurred while updating the product.' })
    //   } else {
    //     res.json(product)
    //   }
    // })
  }

  deleteProduct(req: Request, res: Response, next: NextFunction) {
    // Delete a product from the database based on its ID
    const productId = req.params.id
    // Product.findByIdAndDelete(productId, (err) => {
    //   if (err) {
    //     res.status(500).json({ error: 'An error occurred while deleting the product.' })
    //   } else {
    //     res.json({ message: 'Product deleted successfully.' })
    //   }
    // })
  }

  async createProductGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body

      if (req.files) {
        const images = (req.files as Express.Multer.File[]).map((file: Express.Multer.File) => {
          return { product_id: Number(productId), image: file.path.split('/').at(-1) }
        })

        const gallery = await db('product_gallery').insert(images, ['image'])
        res.status(201).json({ data: { success: true } })
        return gallery
      }
    } catch (err) {
      next(err)
    }
  }
}

export default new ProductController()

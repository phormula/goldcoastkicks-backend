import Product from '@app/model/Product'
import Size from '@app/model/Size'
import db from '@app/database/knexdb'

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`

      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 15
      const offset = (page - 1) * limit
      console.log(limit, offset)
      const products = await Product.query()
        .select('products.*', 'brand.name as brand', 'colorway.name as color')
        .leftJoinRelated('brand')
        .leftJoinRelated('colorway')
        .limit(limit)
        .offset(offset)

      const totalProducts = await Product.query().count('id').first()
      // console.log(products)
      const productData = products.map((product) => {
        console.log(product.image)
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

  async getProduct(req, res, next) {
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

  async createProduct(req, res, next) {
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

  updateProduct(req, res, next) {
    // Update a product in the database based on the data from the request body
    const productId = req.params.id
    Product.findByIdAndUpdate(productId, req.body, { new: true }, (err, product) => {
      if (err) {
        res.status(500).json({ error: 'An error occurred while updating the product.' })
      } else {
        res.json(product)
      }
    })
  }

  deleteProduct(req, res, next) {
    // Delete a product from the database based on its ID
    const productId = req.params.id
    Product.findByIdAndDelete(productId, (err) => {
      if (err) {
        res.status(500).json({ error: 'An error occurred while deleting the product.' })
      } else {
        res.json({ message: 'Product deleted successfully.' })
      }
    })
  }

  async createProductGallery(req, res, next) {
    try {
      const { productId } = req.body
      const images = req.files.map((file) => {
        return { product_id: Number(productId), image: file.path.split('/').at(-1) }
      })

      const gallery = await db('product_gallery').insert(images, ['image'])
      res.status(201).json({ data: { success: true } })

      return gallery
    } catch (err) {
      next(err)
    }
  }
}

export default new ProductController()

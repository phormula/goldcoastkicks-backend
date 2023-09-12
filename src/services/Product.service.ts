import fs from 'fs/promises'
import path from 'path'
import { filterKey } from '@app/helpers'
import db from '@app/database/knexdb'
import Product from '@model/Product'
import Brand from '@model/Brand'
import Position from '@model/Position'
import Court from '@model/Court'
import Type from '@model/Type'
import ProductGallery from '@model/ProductGallery'
import User from '@model/User'
import { isAdmin } from '@app/helpers'

class ProductService {
  async getAllProducts(requestQuery: { [key: string]: any }, baseUrl: string) {
    try {
      const { brand, position, type, court, page, limit, query } = requestQuery
      const pageData = Number(page) || 1
      const limitData = Number(limit) || 15
      const offset = (pageData - 1) * limitData

      let productQuery = Product.query()
        .distinct(
          'products.*',
          'brand.name as brand',
          'selling_currency.symbol as currency_symbol',
          'selling_currency.code as currency_code',
        )
        .leftJoinRelated('brand')
        .leftJoinRelated('position')
        .leftJoinRelated('type')
        .leftJoinRelated('court')
        .leftJoinRelated('selling_currency')

      let countQuery = Product.query()

      if (query) {
        const searchWords = query.split(' ')
        productQuery = productQuery
          .orWhere((builder) => {
            for (const word of searchWords) builder.orWhere('brand.name', 'like', `%${word}%`)
          })
          .orWhere((builder) => {
            for (const word of searchWords) builder.orWhere('position.name', 'like', `%${word}%`)
          })
          .orWhere((builder) => {
            for (const word of searchWords) builder.orWhere('type.name', 'like', `%${word}%`)
          })
          .orWhere((builder) => {
            for (const word of searchWords) builder.orWhere('court.name', 'like', `%${word}%`)
          })
          .orWhere((builder) => {
            for (const word of searchWords) builder.orWhere('products.name', 'like', `%${word}%`)
          })
          .orWhere((builder) => {
            for (const word of searchWords) builder.orWhere('products.sku', 'like', `%${word}%`)
          })
          .orWhere((builder) => {
            for (const word of searchWords) builder.orWhere('products.description', 'like', `%${word}%`)
          })
        const subquery = productQuery.clone()
        countQuery = countQuery.from(subquery.as('results'))
      }
      if (brand) {
        productQuery = productQuery.where('brand.id', Number(brand))
        countQuery = countQuery.where('brand_id', Number(brand))
      }
      if (position) {
        productQuery = productQuery.where('position.id', Number(position))
        countQuery = countQuery.leftJoinRelated('position').where('position.id', Number(position))
      }
      if (type) {
        productQuery = productQuery.where('type.id', Number(type))
        countQuery = countQuery.leftJoinRelated('type').where('type.id', Number(type))
      }
      if (court) {
        productQuery = productQuery.where('court.id', Number(court))
        countQuery = countQuery.leftJoinRelated('court').where('court.id', Number(court))
      }

      const totalProducts = (await countQuery.count('* as count').first()) as { [key: string]: any }
      const products = await productQuery.limit(limitData).offset(offset).groupBy('products.id')
      const productData = products.map((product) => {
        const image = { image: `${baseUrl}/file/image/${product.image}` }
        return { ...product, ...image }
      })

      return {
        data: productData,
        current_page: pageData,
        per_page: limitData,
        total: totalProducts['count'],
        last_page: Math.ceil(totalProducts['count'] / limitData),
      }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async getProduct(id: string | number, baseUrl: string, user: User) {
    try {
      let productQuery = Product.query()
        .findById(id)
        .withGraphFetched('[sizes(defaultSelects),gallery,colorways(default),brand(default),selling_currency]')
        .withGraphFetched('[position(defaultSelects),type(defaultSelects),court(defaultSelects)]')
      if (isAdmin(user)) {
        productQuery = productQuery.withGraphFetched('[buying_currency]')
      }

      const product = await productQuery
      if (product) {
        product.gallery = product.gallery.map((g) => ({ ...g, image: `${baseUrl}/file/image/${g.image}` }))
        const { buying_price, buying_currency_id, ...productData } = product

        const result = !isAdmin(user) ? productData : product

        return { data: { ...result, image: `${baseUrl}/file/image/${product.image}` } }
      }

      return { status: 'error', message: 'Product not found' }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async createProduct(data: { [key: string]: any }, file: any) {
    try {
      const {
        name,
        description,
        sku,
        sizes,
        buying_price,
        selling_price,
        buying_currency_id,
        selling_currency_id,
        brand,
        position,
        type,
        court,
        colorways,
      } = data
      const image = file?.path.split('/').at(-1)
      const [product] = await Product.query().insertGraph(
        [
          {
            name,
            description,
            sku,
            image,
            buying_price,
            selling_price,
            position: position.map((s: any) => ({ id: s })),
            type: type.map((s: any) => ({ id: s })),
            court: court.map((s: any) => ({ id: s })),
            sizes: sizes.map((s: any) => ({ id: s })),
            colorways: colorways.map((c: any) => ({ id: c })),
            buying_currency: { id: buying_currency_id },
            selling_currency: { id: selling_currency_id },
            ...(brand ? { brand: [{ id: brand }] } : {}),
          },
        ],
        {
          relate: [
            'position',
            'type',
            'court',
            'sizes',
            'colorways',
            'buying_currency',
            'selling_currency',
            ...(brand ? ['brand'] : []),
          ],
        },
      )

      return { data: { ...product } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async updateProduct(id: string | number, data: { [key: string]: any }, file: any = null) {
    try {
      const {
        name,
        description,
        sku,
        sizes,
        buying_price,
        selling_price,
        buying_currency_id,
        selling_currency_id,
        brand,
        position,
        type,
        court,
        colorways,
      } = data
      const image = file && file.path.split('/').at(-1)
      const updateProduct = await Product.query().upsertGraph(
        {
          id,
          name,
          description,
          sku,
          ...(image && { image }),
          buying_price,
          selling_price,
          buying_currency: { id: buying_currency_id },
          selling_currency: { id: selling_currency_id },
          sizes: sizes.map((s: any) => ({ id: s })),
          colorways: colorways.map((c: any) => ({ id: c })),
          brand: [{ id: brand }],
          position: position.map((s: any) => ({ id: s })),
          type: type.map((s: any) => ({ id: s })),
          court: court.map((s: any) => ({ id: s })),
        },
        {
          relate: true,
          unrelate: true,
        },
      )

      return updateProduct
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async deleteProduct(id: string | number) {
    try {
      const product = await Product.query().findById(id)

      if (product) {
        await product.$relatedQuery('sizes').unrelate()
        await product.$relatedQuery('colorways').unrelate()
        await product.$query().delete()

        return { data: { status: 'success', message: 'Product deleted successfully' } }
      }

      return { data: { status: 'error', message: 'Error deleting product!' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async createProductGallery(productId: string | number, files: Express.Multer.File[]) {
    try {
      if (files) {
        const images = files.map((file: Express.Multer.File) => {
          return { product_id: Number(productId), image: file.path.split('/').at(-1) }
        })

        await db('product_gallery').insert(images, ['image'])

        return { data: { status: 'success', message: 'Product gallery added successfully' } }
      }

      return { data: { status: 'error', message: 'Error adding product gallery!' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async updateProductGallery(productId: string | number, files: Express.Multer.File[]) {
    try {
      const gallery = await ProductGallery.query().where({ product_id: Number(productId) })
      if (gallery.length) {
        gallery.forEach((g) => {
          const filePath = path.join(__dirname, '..', 'resources', 'static', 'assets', 'uploads')
          fs.unlink(filePath + '/' + g.image)
        })

        await ProductGallery.query()
          .delete()
          .where({ product_id: Number(productId) })
      }

      if (files.length) {
        const images = files.map((file: Express.Multer.File) => {
          return { product_id: Number(productId), image: file.path.split('/').at(-1) }
        })
        await db('product_gallery').insert(images, ['image'])
      }

      return { data: { status: 'success', message: 'Product gallery updated successfully' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async prefilters() {
    try {
      const brands = await Brand.query().select()
      const positions = await Position.query().select()
      const courts = await Court.query().select()
      const types = await Type.query().select()

      const filters = [
        ...filterKey(brands, 'brand'),
        ...filterKey(positions, 'position'),
        ...filterKey(courts, 'court'),
        ...filterKey(types, 'type'),
      ]

      return { data: filters }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }
}

export default new ProductService()

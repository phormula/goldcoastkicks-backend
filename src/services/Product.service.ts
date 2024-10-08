import fs from 'fs/promises'
import path from 'path'
import { createUniqueProductSlug, filterKey, modelId } from '@app/helpers'
import db from '@app/database/knexdb'
import Product from '@model/Product'
import Brand from '@model/Brand'
import Position from '@model/Position'
import Court from '@model/Court'
import Type from '@model/Type'
import ProductGallery from '@model/ProductGallery'
import User from '@model/User'
import { isAdmin } from '@app/helpers'
import ProductFinancial from '@app/model/ProductFinancial'

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
        .leftJoinRelated('colorway')
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
      const idOrSlug = isNaN(Number(id)) ? { slug: id } : { id }
      let productQuery = Product.query()
        .where(idOrSlug)
        .withGraphFetched('[sizes(defaultSelects),colorway(default),brand(default),selling_currency]')
        .withGraphFetched('[position(defaultSelects),type(defaultSelects),court(defaultSelects), gallery.color]')
      if (isAdmin(user)) {
        productQuery = productQuery.withGraphFetched('[buying_currency,financial]')
      }

      const product = await productQuery.first()
      const imgUrl = `${baseUrl}/file/image`
      if (product) {
        const gallery = product.gallery.map((g) => ({ ...g, image: `${imgUrl}/${g.image}` }))
        const productRes = { ...product, ...{ gallery } }
        const { buying_price, buying_currency_id, payment_fees, profit_percent, ...productData } = productRes
        const result = !isAdmin(user) ? productData : productRes

        return { data: { ...result, image: `${imgUrl}/${product.image}` } }
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
        slug,
        weight,
        sizes,
        buying_price,
        selling_price,
        buying_currency_id,
        selling_currency_id,
        profit_percent,
        tax,
        payment_fees,
        brand_id,
        position,
        type,
        court,
        colorway_id,
      } = data
      let productSlug: string

      const productWithSlugs = await Product.query().whereNotNull('slug')
      const existingSlugs = productWithSlugs.map((p) => p.slug)
      productSlug = createUniqueProductSlug(slug || name, existingSlugs)
      console.log(productSlug)

      const image = file?.path.split('/').at(-1)
      const product = await Product.query().insertGraph(
        {
          name,
          description,
          sku,
          slug: productSlug,
          weight,
          image,
          buying_price,
          selling_price,
          profit_percent,
          tax,
          payment_fees,
          brand: { id: Number(brand_id) },
          colorway: { id: Number(colorway_id) },
          buying_currency: { id: buying_currency_id },
          selling_currency: { id: selling_currency_id },
          sizes: modelId(sizes),
          position: modelId(position),
          type: modelId(type),
          court: modelId(court),
        },

        {
          relate: ['position', 'type', 'court', 'sizes', 'colorway', 'buying_currency', 'selling_currency', 'brand'],
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
        weight,
        sizes,
        buying_price,
        selling_price,
        buying_currency_id,
        selling_currency_id,
        profit_percent,
        tax,
        payment_fees,
        brand_id,
        position,
        type,
        court,
        colorway_id,
      } = data

      const image = file && file.path.split('/').at(-1)
      const updateProduct = await Product.query().upsertGraph(
        {
          id,
          name,
          description,
          sku,
          weight,
          ...(image && { image }),
          buying_price,
          selling_price,
          profit_percent,
          tax,
          payment_fees,
          colorway: { id: colorway_id },
          brand: { id: Number(brand_id) },
          buying_currency: { id: buying_currency_id },
          selling_currency: { id: selling_currency_id },
          sizes: modelId(sizes),
          position: modelId(position),
          type: modelId(type),
          court: modelId(court),
        },
        {
          relate: true,
          unrelate: true,
          noUpdate: ['buying_currency', 'selling_currency', 'colorway', 'brand', 'sizes', 'position', 'type', 'court'],
        },
      )

      return updateProduct
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async deleteProduct(id: string | number) {
    try {
      const product = await Product.query().findById(Number(id))

      if (product) {
        await product.$relatedQuery('sizes').unrelate()
        await product.$relatedQuery('position').unrelate()
        await product.$relatedQuery('type').unrelate()
        await product.$relatedQuery('court').unrelate()
        await product.$relatedQuery('gallery').delete()
        await product.$relatedQuery('financial').delete()
        await product.$query().delete()

        return { data: { status: 'success', message: 'Product deleted successfully' } }
      }

      return { data: { status: 'error', message: 'Error deleting product!' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async createProductGallery(productId: string | number, files: Express.Multer.File[], colors: any[]) {
    try {
      if (files) {
        const images = files.map((file: Express.Multer.File, index) => {
          return {
            product_id: Number(productId),
            image: file.path.split('/').at(-1),
            color: { id: Number(colors[index]) },
          }
        })

        await ProductGallery.query().insertGraph(images, { relate: ['color'] })

        return { data: { status: 'success', message: 'Product gallery added successfully' } }
      }

      return { data: { status: 'error', message: 'Error adding product gallery!' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async updateProductGallery(productId: string | number, files: Express.Multer.File[], colors: any[]) {
    try {
      const gallery = await ProductGallery.query().where({ product_id: Number(productId) })
      if (gallery.length) {
        gallery.forEach(async (g) => {
          const filePath = path.join(__dirname, '..', 'resources', 'static', 'assets', 'uploads')
          fs.unlink(filePath + '/' + g.image)
        })

        await ProductGallery.query()
          .delete()
          .where({ product_id: Number(productId) })
      }

      if (files.length) {
        const images = files.map((file: Express.Multer.File, index) => {
          return {
            product_id: Number(productId),
            image: file.path.split('/').at(-1),
            colorway_id: Number(colors[index]),
          }
        })
        await db('product_gallery').insert(images, ['image'])
      }

      return { data: { status: 'success', message: 'Product gallery updated successfully' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async createProductFinancial(productId: string | number, profit_percent: string, tax_percent: string) {
    try {
      const financial = await ProductFinancial.query().insertGraph(
        { product: [{ id: Number(productId) }], profit_percent, tax_percent },
        { relate: ['product'] },
      )
      if (financial) {
        return { data: { status: 'success', message: 'Product financial added successfully' } }
      }

      return { data: { status: 'error', message: 'Error adding product financial!' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async updateProductFinancial(productId: string | number, profit_percent: string, tax_percent: string) {
    try {
      const financial = await ProductFinancial.query()
        .update({ profit_percent, tax_percent })
        .where({ product_id: Number(productId) })

      if (financial) {
        return { data: { status: 'success', message: 'Product financial updated successfully' } }
      }

      return { data: { status: 'error', message: 'Product financial was not updated' } }
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

  async priceFilter() {
    try {
      const minProduct = await Product.query().min('selling_price as min_price').first()
      const maxProduct = await Product.query().max('selling_price as max_price').first()

      const min = Math.floor(Number(minProduct?.min_price))
      const max = Math.ceil(Number(maxProduct?.max_price))

      return { data: { min, max } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }
}

export default new ProductService()

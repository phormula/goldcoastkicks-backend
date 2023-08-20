import { Model } from 'objection'
import Size from '@model/Size'
import Brand from '@model/Brand'
import Colorway from '@model/Colorway'
import ProductGallery from '@model/ProductGallery'

class Product extends Model {
  name!: string
  description!: string
  sku!: string
  image!: string
  price!: string
  sizes!: any[]
  brand!: any[]
  colorway!: any[]
  gallery!: any[]

  static get tableName() {
    return 'products'
  }

  static get relationMappings() {
    return {
      sizes: {
        relation: Model.ManyToManyRelation,
        modelClass: Size,
        join: {
          from: 'products.id',
          through: {
            from: 'product_sizes.product_id',
            to: 'product_sizes.size_id',
          },
          to: 'sizes.id',
        },
      },
      gallery: {
        relation: Model.HasManyRelation,
        modelClass: ProductGallery,
        join: {
          from: 'products.id',
          to: 'product_gallery.product_id',
        },
      },
      brand: {
        relation: Model.BelongsToOneRelation,
        modelClass: Brand,
        join: {
          from: 'brands.id',
          to: 'products.brand_id',
        },
      },
      colorway: {
        relation: Model.BelongsToOneRelation,
        modelClass: Colorway,
        join: {
          from: 'colorways.id',
          to: 'products.colorway_id',
        },
      },
    }
  }
}

export default Product

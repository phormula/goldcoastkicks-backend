import { Model } from 'objection'
import Size from '@model/Size'
import Brand from '@model/Brand'
import Colorway from '@model/Colorway'
import ProductGallery from '@model/ProductGallery'
import Currency from '@model/Currency'
import Position from '@model/Position'
import Type from '@model/Type'
import Court from '@model/Court'

class Product extends Model {
  id: number | string
  name: string
  description: string
  sku: string
  image: string
  selling_price: string
  sizes: any[]
  brand: any[]
  colorways: any[]
  gallery: any[]
  buying_currency: any
  selling_currency: any
  position: any
  type: any
  court: any

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
      colorways: {
        relation: Model.ManyToManyRelation,
        modelClass: Colorway,
        join: {
          from: 'products.id',
          through: {
            from: 'product_colorways.product_id',
            to: 'product_colorways.colorway_id',
          },
          to: 'colorways.id',
        },
      },
      position: {
        relation: Model.ManyToManyRelation,
        modelClass: Position,
        join: {
          from: 'products.id',
          through: {
            from: 'product_positions.product_id',
            to: 'product_positions.position_id',
          },
          to: 'positions.id',
        },
      },
      court: {
        relation: Model.ManyToManyRelation,
        modelClass: Court,
        join: {
          from: 'products.id',
          through: {
            from: 'product_courts.product_id',
            to: 'product_courts.court_id',
          },
          to: 'courts.id',
        },
      },
      type: {
        relation: Model.ManyToManyRelation,
        modelClass: Type,
        join: {
          from: 'products.id',
          through: {
            from: 'product_types.product_id',
            to: 'product_types.type_id',
          },
          to: 'types.id',
        },
      },
      buying_currency: {
        relation: Model.BelongsToOneRelation,
        modelClass: Currency,
        join: {
          from: 'products.buying_currency_id',
          to: 'currencies.id',
        },
      },
      selling_currency: {
        relation: Model.BelongsToOneRelation,
        modelClass: Currency,
        join: {
          from: 'products.selling_currency_id',
          to: 'currencies.id',
        },
      },
    }
  }
}

export default Product

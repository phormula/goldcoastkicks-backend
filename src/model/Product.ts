import ModelBase from '@model/ModelBase'
import Size from '@model/Size'
import Brand from '@model/Brand'
import Colorway from '@model/Colorway'
import ProductGallery from '@model/ProductGallery'
import Currency from '@model/Currency'
import Position from '@model/Position'
import Type from '@model/Type'
import Court from '@model/Court'
import ProductFinancial from '@model/ProductFinancial'

class Product extends ModelBase {
  id: number | string
  name: string
  description: string
  sku: string
  weight: string
  image: string
  buying_price: string
  buying_currency_id: string | number
  selling_price: string
  profit_percent: number
  tax: number
  payment_fees: number
  sizes: any[]
  brand: any
  colorway: any
  gallery: any[]
  buying_currency: any
  selling_currency: any
  position: any
  type: any
  court: any
  min_price: number
  max_price: number

  static get tableName() {
    return 'products'
  }

  static modifiers = {
    customerSelect(query: any) {
      query.select(
        'id',
        'name',
        'description',
        'sku',
        'image',
        'selling_currency_id',
        'selling_price',
        'weight',
        'brand_id',
        'colorway_id',
        'created_at',
        'updated_at',
      )
    },
  }

  static get relationMappings() {
    return {
      sizes: {
        relation: ModelBase.ManyToManyRelation,
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
        relation: ModelBase.HasManyRelation,
        modelClass: ProductGallery,
        join: {
          from: 'products.id',
          to: 'product_gallery.product_id',
        },
      },
      brand: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: Brand,
        join: {
          from: 'brands.id',
          to: 'products.brand_id',
        },
      },
      colorway: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: Colorway,
        join: {
          from: 'colorways.id',
          to: 'products.colorway_id',
        },
      },
      position: {
        relation: ModelBase.ManyToManyRelation,
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
        relation: ModelBase.ManyToManyRelation,
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
        relation: ModelBase.ManyToManyRelation,
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
        relation: ModelBase.BelongsToOneRelation,
        modelClass: Currency,
        join: {
          from: 'products.buying_currency_id',
          to: 'currencies.id',
        },
      },
      selling_currency: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: Currency,
        join: {
          from: 'products.selling_currency_id',
          to: 'currencies.id',
        },
      },
      financial: {
        relation: ModelBase.HasOneRelation,
        modelClass: ProductFinancial,
        join: {
          from: 'products.id',
          to: 'product_financials.product_id',
        },
      },
    }
  }
}

export default Product

import { Model } from 'objection'

class Vendor extends Model {
  static get tableName() {
    return 'vendors'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      // required: ['first_name', 'last_name', 'email', 'password'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 },
      },
    }
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    const User = require('./User').default
    const Category = require('./Category').default
    const Service = require('./Service').default

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'vendors.user_id',
          to: 'users.id',
        },
      },
      categories: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: 'vendors.category_id',
          to: 'vendor_categories.id',
        },
      },
      services: {
        relation: Model.ManyToManyRelation,
        modelClass: Service,
        join: {
          from: 'vendors.id',
          through: {
            from: 'vendor_services.vendor_id',
            to: 'vendor_services.service_id',
          },
          to: 'services.id',
        },
      },
      managers: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'vendors.id',
          through: {
            from: 'vendor_managers.vendor_id',
            to: 'vendor_managers.user_id',
          },
          to: 'users.id',
        },
      },
    }
  }
}

export default Vendor

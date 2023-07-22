import { Model } from 'objection'

class Category extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'vendor_categories'
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
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
    const Vendor = require('./Vendor').default

    return {
      vendors: {
        relation: Model.HasManyRelation,
        modelClass: Vendor,
        join: {
          from: 'vendor_categories.id',
          to: 'vendors.category_id',
        },
      },
    }
  }
}

export default Category

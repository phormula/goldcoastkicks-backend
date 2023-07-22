import { Model } from 'objection'

class Service extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'services'
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1, maxLength: 255 },
      },
    }
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    const Vendor = require('./Vendor').default

    return {
      vendors: {
        relation: Model.ManyToManyRelation,
        modelClass: Vendor,
        join: {
          from: 'services.id',
          through: {
            from: 'vendor_services.service_id',
            to: 'vendor_services.vendor_id',
          },
          to: 'vendors.id',
        },
      },
    }
  }
}

export default Service

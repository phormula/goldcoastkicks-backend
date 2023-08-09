import { Model } from 'objection'

class Service extends Model {
  static get tableName() {
    return 'services'
  }

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
}

export default Service

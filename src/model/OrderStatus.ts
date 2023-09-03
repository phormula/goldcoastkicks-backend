import { Model } from 'objection'

class OrderStatus extends Model {
  static get tableName() {
    return 'order_statuses'
  }

  static selectAsObject() {
    return this.query()
      .select('status.key as status_key', 'status.value as status_value', 'status.color as status_color')
      .as('status')
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['key', 'value'],
      properties: {
        id: { type: 'integer' },
        key: { type: 'string' },
        value: { type: 'string' },
        color: { type: 'string' },
        description: { type: 'string' },
      },
    }
  }
}

export default OrderStatus

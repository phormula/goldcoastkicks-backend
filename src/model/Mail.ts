import ModelBase from '@model/ModelBase'

class Mail extends ModelBase {
  static get tableName() {
    return 'mail_templates'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['type'],
      properties: {
        id: { type: 'integer' },
        type: { type: 'string', minLength: 1, maxLength: 100 },
        subject: { type: 'string' },
        text: { type: 'text' },
        html: { type: 'html' },
      },
    }
  }
}

export default Mail

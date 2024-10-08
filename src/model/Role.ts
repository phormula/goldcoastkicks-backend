import ModelBase from '@model/ModelBase'
import User from '@model/User'

class Role extends ModelBase {
  key: string
  name: string
  description: string

  static get tableName() {
    return 'roles'
  }

  static modifiers = {
    defaultSelects(query: any) {
      query.select(`roles.id`, 'roles.key', `roles.name`)
    },
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

  static get relationMappings() {
    return {
      users: {
        relation: ModelBase.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'roles.id',
          through: {
            from: 'user_roles.role_id',
            to: 'user_roles.user_id',
          },
          to: 'users.id',
        },
      },
    }
  }
}

export default Role

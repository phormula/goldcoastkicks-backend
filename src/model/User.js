import { compare } from 'bcrypt'
import { Model } from 'objection'
import { generateTokenHelper, mailHelper } from '@app/helpers'
import Role from '@model/Role'

class User extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'users'
  }

  static modifiers = {
    defaultSelects(query) {
      query.select('id', 'first_name', 'last_name', 'email')
    },
  }

  generateToken(expiresIn = '2h') {
    const data = { id: this.id, email: this.email }
    return generateTokenHelper(data, expiresIn)
  }

  validatePassword(plainPassword) {
    return compare(plainPassword, this.password)
  }

  sendMail(mail) {
    const payload = {
      ...mail,
      to: `${this.first_name} ${this.last_name} <${this.email}>`,
    }
    return mailHelper(payload)
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['first_name', 'last_name', 'email', 'password'],

      properties: {
        id: { type: 'integer' },
        first_name: { type: 'string', minLength: 1, maxLength: 255 },
        last_name: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 },
      },
    }
  }

  static get relationMappings() {
    return {
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'users.id',
          through: {
            from: 'user_roles.user_id',
            to: 'user_roles.role_id',
          },
          to: 'roles.id',
        },
      },
    }
  }
}

export default User

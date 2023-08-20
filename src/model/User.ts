import { compare } from 'bcrypt'
import { Model } from 'objection'
import { generateTokenHelper } from '@app/helpers'
import Role from '@app/model/Role'
import MailService from '@app/services/Mail.service'

class User extends Model {
  id: number
  email: string
  password: string
  first_name: string
  last_name: string
  roles: any[]

  static get tableName() {
    return 'users'
  }

  static modifiers = {
    defaultSelects(query: any) {
      query.select('id', 'first_name', 'last_name', 'email')
    },
  }

  generateToken(expiresIn = '24h') {
    const data = { id: this.id, email: this.email }
    return generateTokenHelper(data, expiresIn)
  }

  validatePassword(plainPassword: string) {
    return compare(plainPassword, this.password)
  }

  sendMail(mail: any) {
    const payload = {
      ...mail,
      to: `${this.first_name} ${this.last_name} <${this.email}>`,
    }
    return MailService.sendMail(payload)
  }

  async save() {
    const userData = {
      id: this.id,
      email: this.email,
      password: this.password,
      first_name: this.first_name,
      last_name: this.last_name,
    }
    if (this.id) {
      await User.query().patchAndFetchById(this.id, userData)
    } else {
      // Create new user
      return User.query().insert(userData)
    }
  }

  async destroy() {
    await User.query().deleteById(this.id)
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

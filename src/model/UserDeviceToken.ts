import ModelBase from '@model/ModelBase'
import User from '@model/User'

class UserDeviceToken extends ModelBase {
  id: number
  user_id: number
  device_type: string
  device_token: string
  device_token_type: string
  user: User

  static get tableName() {
    return 'user_device_tokens'
  }

  static get relationMappings() {
    return {
      user: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_device_tokens.user_id',
          to: 'users.id',
        },
      },
    }
  }
}

export default UserDeviceToken

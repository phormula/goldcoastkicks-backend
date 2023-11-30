import ModelBase from '@model/ModelBase'

class UserAddress extends ModelBase {
  id: number
  user_id: number
  address: string
  house_no: string
  town: string
  city: string
  region: string
  country: string
  is_default: number

  static get tableName() {
    return 'user_addresses'
  }

  static get relationMappings() {
    return {
      user: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: UserAddress,
        join: {
          from: 'users.id',
          to: 'user_addresses.user_id',
        },
      },
    }
  }
}

export default UserAddress

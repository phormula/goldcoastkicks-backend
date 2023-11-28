import ModelBase from '@model/ModelBase'

class UserAddress extends ModelBase {
  id: number
  address_1: string
  address_2: string
  house_no: string
  town: string
  city: string
  region: string
  country: string
  default: number

  static get tableName() {
    return 'user_addresses'
  }
}

export default UserAddress

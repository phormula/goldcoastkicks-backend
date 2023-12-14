import ModelBase from '@model/ModelBase'

class PushNotification extends ModelBase {
  id: number
  email: string
  password: string
  first_name: string
  last_name: string
  is_disabled: boolean | number
  roles: any[]

  static get tableName() {
    return 'push_notifications'
  }

  static get relationMappings() {
    return {}
  }
}

export default PushNotification

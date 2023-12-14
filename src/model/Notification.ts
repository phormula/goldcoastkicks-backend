import ModelBase from '@model/ModelBase'
import EmailNotification from '@model/EmailNotification'
import PushNotification from '@model/PushNotification'
import Entity from '@model/Entity'
import User from '@model/User'

class Notification extends ModelBase {
  id: number
  user_id: number
  entity_id: number
  message: string
  is_sent: boolean | number
  roles: any[]

  static get tableName() {
    return 'notifications'
  }

  static get relationMappings() {
    return {
      entity: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: Entity,
        join: {
          from: 'notifications.entity_id',
          to: 'entities.id',
        },
      },
      emailNotifications: {
        relation: ModelBase.HasOneRelation,
        modelClass: EmailNotification,
        join: {
          from: 'notifications.id',
          to: 'email_notifications.notification_id',
        },
      },
      pushNotifications: {
        relation: ModelBase.HasOneRelation,
        modelClass: PushNotification,
        join: {
          from: 'notifications.id',
          to: 'push_notifications.notification_id',
        },
      },
      user: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'notifications.user_id',
          to: 'users.id',
        },
      },
    }
  }
}

export default Notification

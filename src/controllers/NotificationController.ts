import { Request, Response, NextFunction } from 'express'
import Type from '@model/Type'
import NotificationService from '@app/services/Notification.service'
import User from '@app/model/User'
import PushNotificationService from '@app/services/PushNotification.service'

class TypeController {
  async getAllNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await NotificationService.getAllNotifications(req.query, req.user as User)

      return res.send(notifications)
    } catch (error) {
      return next(error)
    }
  }

  async getType(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await Type.query().findById(req.params.id)

      if (result) {
        return res.send({ data: result })
      }

      return res.status(404).json({ status: 'error', message: 'Type not found' })
    } catch (error) {
      return next(error)
    }
  }

  async sendPush(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.body
      const tokens = await NotificationService.getUserDeviceToken(user_id)

      for (const token of tokens) {
        const push = await PushNotificationService.send({
          token,
          notification: {
            title: 'This is a title',
            body: 'Message Text',
            image:
              'https://c0.klipartz.com/pngpicture/924/1010/gratis-png-par-de-zapatos-de-cuero-marron-zapatillas-de-cuero-zapatillas-zapatos-de-los-hombres-thumbnail.png',
          },
          android: {
            collapse_key: 'sneaker-notify',
            notification: { channel_id: 'pop-notifications' },
          },
          data: {
            title: 'titleText',
            body: 'message Text',
            message:
              'The slice() method extracts the part of a string and returns the extracted part in a new string. If we want to remove the first character of a string then it can be done by specifying the start index from which the string needs to be extracted. We can also slice the last element.',
            url: 'https://crm2015.friendlysol.com/#/chat?chat_id=21',
          },
        })
        if (push.error) {
          console.log('token not sent', token)
          console.log(push)
          // return res.status(500).json(push)
        }
      }

      return res.status(200).json({ data: { message: 'Push completed' } })
    } catch (error) {
      return next(error)
    }
  }

  async updateType(req: Request, res: Response, next: NextFunction) {
    try {
      const typeId = req.params.id
      const { name, description } = req.body
      const type = await Type.query().update({ name, description }).where({ id: typeId })

      return res.status(200).json({ data: type })
    } catch (error) {
      return next(error)
    }
  }

  async deleteType(req: Request, res: Response, next: NextFunction) {
    try {
      const typeId = req.params.id
      await Type.query().findById(typeId).delete()

      return res.status(200).json({ data: { status: 'success', message: 'Type deleted successfully' } })
    } catch (error) {
      return next(error)
    }
  }
}

export default new TypeController()

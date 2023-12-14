import 'dotenv/config'
import fetch from 'cross-fetch'
import { JWT } from 'google-auth-library'
import keys from '@app/config/sneaker-appp-firebase-adminsdk-g955v-7806289537.json'
import { PushNotification } from '@app/types/push-notification.type'

class PushNotificationService {
  async send(data: PushNotification) {
    try {
      const fcmToken = await this.getAccessToken()
      const response = await fetch(`${process.env.FCM_MESSAGING}`, {
        method: 'POST',
        body: JSON.stringify({ message: data }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fcmToken}`,
        },
      })
      const res = await response.json()
      return res
    } catch (error: any) {
      console.error(error)
      throw new Error(error)
    }
  }

  getAccessToken() {
    return new Promise(function (resolve, reject) {
      const jwtClient = new JWT(
        keys.client_email,
        undefined,
        keys.private_key,
        ['https://www.googleapis.com/auth/firebase.messaging'],
        undefined,
      )
      jwtClient.authorize(function (err, tokens) {
        if (err) {
          reject(err)
          return
        }
        resolve(tokens?.access_token)
      })
    })
  }
}

export default new PushNotificationService()

import 'dotenv/config'
import { OAuth2Client } from 'google-auth-library'

class PaymentService {
  client: OAuth2Client

  constructor(clientId: string) {
    this.client = new OAuth2Client(clientId)
  }

  async pay(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.client._clientId,
      })

      const payload = ticket.getPayload()
      return payload
    } catch (error: any) {
      return error
    }
  }
}
export default new PaymentService(String(process.env.GOOGLE_CLIENT_ID))

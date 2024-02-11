import { PaymentPayload } from '@app/types/payment.type'
import 'dotenv/config'

class PaymentService {
  paystackBaseUrl: string
  paystackKey: string

  constructor() {
    this.paystackBaseUrl = 'https://api.paystack.co'
    this.paystackKey = String(process.env.PAYSTACK_SECRET_KEY)
  }

  async pay(payload: PaymentPayload) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.paystackKey}`,
      }

      const response = await fetch(`${this.paystackBaseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      return result
    } catch (error: any) {
      console.error(error)
      throw new Error(error)
    }
  }
}
export default new PaymentService()

export interface PaymentPayload {
  amount: number
  email: string
  currency: string
  mobile_money: {
    phone: string
    provider: string
  }
}

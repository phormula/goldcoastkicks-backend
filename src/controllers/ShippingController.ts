import { Request, Response, NextFunction } from 'express'
import Shipping from '@model/Shipping'
import Currency from '@model/Currency'

class ShippingController {
  async getAllShippings(req: Request, res: Response, next: NextFunction) {
    try {
      const shippings = await Shipping.query().withGraphJoined('currency(default)')

      return res.send({ data: shippings })
    } catch (error) {
      return next(error)
    }
  }

  async getShipping(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await Shipping.query().withGraphJoined('currency(default)').findById(req.params.id)

      if (result) {
        return res.send({ data: result })
      }

      return res.status(404).json({ data: { status: 'error', message: 'Shipping not found' } })
    } catch (error) {
      return next(error)
    }
  }

  async createShipping(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, amount, duration, currency } = req.body
      const currencyQuery = !Number.isNaN(Number(currency)) ? { id: Number(currency) } : { code: currency }
      const shippingCurrency = await Currency.query().where(currencyQuery).first()
      const shipping = await Shipping.query().insertGraph([{ name, amount, duration, currency: shippingCurrency }], {
        relate: ['currency'],
      })

      return res.status(201).json({ data: shipping })
    } catch (error) {
      return next(error)
    }
  }

  async updateShipping(req: Request, res: Response, next: NextFunction) {
    try {
      const shippingId = req.params.id
      const { name, amount, duration, currency } = req.body
      const currencyQuery = !Number.isNaN(Number(currency)) ? { id: Number(currency) } : { code: currency }
      const shippingCurrency = await Currency.query().where(currencyQuery).first()
      const shipping = await Shipping.query()
        .update({ name, amount, duration, currency_id: shippingCurrency?.id })
        .where({ id: shippingId })

      return res.status(200).json({ data: shipping })
    } catch (error) {
      return next(error)
    }
  }

  async deleteShipping(req: Request, res: Response, next: NextFunction) {
    try {
      const shippingId = req.params.id
      await Shipping.query().findById(shippingId).delete()

      return res.status(200).json({ data: { status: 'success', message: 'Shipping deleted successfully' } })
    } catch (error) {
      return next(error)
    }
  }
}

export default new ShippingController()

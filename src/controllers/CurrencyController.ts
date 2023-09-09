import { Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'
import Currency from '@app/model/Currency'
import CurrencyConverterService from '@app/services/currency-converter.service'
import db from '@app/database/knexdb'

class CurrencyController {
  async getAllCurrencies(req: Request, res: Response, next: NextFunction) {
    try {
      let currencies
      const query = Currency.query()
      const { codes } = req.query

      if (codes) {
        const codeSearch = (codes as string).split(',')
        currencies = await query.whereIn('code', codeSearch)
      } else {
        currencies = await query.select()
      }

      return res.send({ data: currencies })
    } catch (err) {
      return next(err)
    }
  }

  async getCurrency(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await Currency.query().findById(req.params.id)

      if (result) {
        return res.send({ data: result })
      }

      return next(createHttpError(404, 'Currency not found'))
    } catch (err) {
      return next(err)
    }
  }

  async createCurrency(req: Request, res: Response, next: NextFunction) {
    try {
      const { symbol, code, name } = req.body
      const currency = await Currency.query().insert({ symbol, code, name })

      return res.status(201).json({ data: currency })
    } catch (err) {
      return next(err)
    }
  }

  async updateCurrency(req: Request, res: Response, next: NextFunction) {
    try {
      const currencyId = req.params.id
      const { symbol, code, name } = req.body
      const currency = await Currency.query().update({ symbol, code, name }).where({ id: currencyId })

      return res.status(200).json({ data: currency })
    } catch (error) {
      return next(error)
    }
  }

  async deleteCurrency(req: Request, res: Response, next: NextFunction) {
    try {
      const currencyId = req.params.id
      await Currency.query().findById(currencyId).delete()

      return res.status(200).json({ data: { status: 'success', message: 'Currency deleted successfully' } })
    } catch (error) {
      return next(error)
    }
  }

  async addCurrenciesToDb(req: Request, res: Response, next: NextFunction) {
    try {
      const currencies = await CurrencyConverterService.getCurrucies()
      await db('currencies').insert(currencies)

      return res.status(201).send({ success: true })
    } catch (err) {
      return next(err)
    }
  }

  async convert(req: Request, res: Response, next: NextFunction) {
    try {
      const { from, to } = req.body
      const currencyConverter = await CurrencyConverterService.convert(from, to)

      return res.status(200).send({ data: currencyConverter })
    } catch (err) {
      return next(err)
    }
  }
}

export default new CurrencyController()

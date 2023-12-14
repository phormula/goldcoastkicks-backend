import { Request, Response, NextFunction } from 'express'
import CurrencyConverterService from '@app/services/currency-converter.service'
import Currency from '@model/Currency'
import db from '@app/database/knexdb'

class CurrencyController {
  async getAllCurrencies(req: Request, res: Response, next: NextFunction) {
    try {
      const { codes, name, page, limit } = req.query
      const pageData = page ? Number(page) - 1 : 0
      const limitData = Number(limit) || 15

      let query = Currency.query()

      if (codes) {
        const codeSearch = (codes as string).split(',')
        query = query.whereIn('code', codeSearch)
      }
      if (name) {
        query = query.orWhere('name', 'LIKE', `%${String(name)}%`)
      }
      const currencies = await query.page(pageData, limitData)

      return res.send({
        data: currencies.results,
        current_page: pageData + 1,
        per_page: limitData,
        total: currencies.total,
        last_page: Math.ceil(currencies.total / limitData),
      })
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

      return res.status(404).json({ status: 'error', message: 'Currency not found' })
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

import { Request, Response, NextFunction } from 'express'
import Config from '@app/model/Config'
import createHttpError from 'http-errors'

class ConfigController {
  async getAllConfigs(_req: Request, res: Response, next: NextFunction) {
    try {
      const configs = await Config.query()

      return res.send({ data: configs })
    } catch (error) {
      return next(error)
    }
  }

  async getConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await Config.query().findById(req.params.id)

      if (result) return res.send({ data: result })

      return next(createHttpError(404, 'Config not found'))
    } catch (error) {
      return next(error)
    }
  }

  async getConfigByKey(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.query
      const result = await Config.query().where({ key }).first()

      if (result) return res.send({ data: result })

      return next(createHttpError(404, 'Config not found'))
    } catch (error) {
      return next(error)
    }
  }

  async getConfigByKeys(req: Request, res: Response, next: NextFunction) {
    try {
      const { keys } = req.query
      const searchKeys = (keys as string).split(',')
      const result = await Config.query().whereIn('key', searchKeys)

      if (result) return res.send({ data: result })

      return next(createHttpError(404, 'Config not found'))
    } catch (error) {
      return next(error)
    }
  }

  async createConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value, table_name } = req.body

      const config = await Config.query().insert({ key, value, table_name })

      return res.status(201).json({ data: config })
    } catch (error) {
      return next(error)
    }
  }

  async updateConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const configId = req.params.id
      const { key, value, table_name } = req.body
      const config = await Config.query().update({ key, value, table_name }).where({ id: configId })

      return res.status(200).json({ data: config })
    } catch (error) {
      return next(error)
    }
  }

  async deleteConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const configId = req.params.id
      await Config.query().findById(configId).delete()

      return res.status(200).json({ data: { status: 'success', message: 'Config deleted successfully' } })
    } catch (error) {
      return next(error)
    }
  }
}

export default new ConfigController()

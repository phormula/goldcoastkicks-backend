import { Request, Response, NextFunction } from 'express'
import { isAdmin } from '@app/helpers'
import User from '@model/User'
import ModelBase from '@app/model/ModelBase'

export const checkAdminOrOwner =
  (model: typeof ModelBase, ownerField: string) => async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User
    const itemId = req.params.id

    try {
      if (isAdmin(user)) {
        return next()
      }

      const item = await model.query().findById(itemId)

      if (!item) {
        return res.status(404).json({ error: 'Item not found' })
      }

      if ((item as any)[ownerField] === user.id) {
        return next()
      }

      return res.status(403).json({ error: 'Unauthorized' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

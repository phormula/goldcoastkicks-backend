import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import Role from '@app/model/Role'
import { getCommonIds } from '@app/helpers'

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const roleId = await Role.query()
      .select('id')
      .whereIn(['key'], [['super-admin'], ['admin']])

    const reqUserRoles = req.user ? req.user.roles : []
    const hasAccess = getCommonIds(roleId, reqUserRoles)
    if (!hasAccess.length) {
      const error = createError(401, 'Not authorized!')

      return next(error)
    }
  } catch (err: any) {
    return next({ status: 500, ...err })
  }
  return next()
}

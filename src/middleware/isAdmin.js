import createError from 'http-errors'
import Role from '@model/Role'
import { getCommonIds } from '@app/helpers'

export default async function (req, res, next) {
  try {
    const roleId = await Role.query()
      .select('id')
      .whereIn(['name'], [['super-admin'], ['admin']])

    const hasAccess = getCommonIds(roleId, req.user.roles)
    if (!hasAccess.length) {
      const error = createError(401, 'Not authorized!')

      return next(error)
    }
  } catch (err) {
    return next({ status: 500, ...err })
  }
  return next()
}

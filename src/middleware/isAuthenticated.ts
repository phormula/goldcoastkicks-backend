import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    const error = createError(401, 'Not authenticated!')
    return next(error)
  }
  return next()
}

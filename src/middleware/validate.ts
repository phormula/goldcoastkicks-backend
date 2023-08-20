import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export function validate(validations: any[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    return res.status(422).json({ message: 'Validation errors', errors: errors.array() })
  }
}

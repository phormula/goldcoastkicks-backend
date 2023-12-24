import 'dotenv/config'
import csrf from 'csrf'
import path, { join } from 'path'
import { Router } from 'express'
import { validate, isPassResetToken, checkCsrfToken, isAdmin } from '@app/middleware'
import AuthValidations from '@app/routes/validations/auth'
import AuthController from '@app/controllers/AuthController'
import { validateWeb } from '@app/middleware/validate'
import Config from '@app/model/Config'

const router = Router()

const Tokens = new csrf()
const secret = Tokens.secretSync()
const token = Tokens.create(secret)

router.get('/*', async (req, res, next) => {
  const config = await Config.query().where({ key: 'under_construction' }).first()

  if (config && config.value === '1' && !req.user) {
    return res.render(join(__dirname, '..', '..', 'views', 'login'), { csrfToken: token, status: '' })
  }
  return next()
})

import('./build/handler.mjs')
  .then((module) => router.use(module.handler))
  .catch((error) => {
    console.error('Error importing module:', error)
  })

router.get('/auth/resetpass', validate(AuthValidations.changePasswordPageRules), isPassResetToken, (_req, res) => {
  res.render(join(__dirname, '..', '..', 'views', 'reset'), { csrfToken: token, status: '' })
})
router.post(
  '/auth/resetpass',
  validate(AuthValidations.resetPasswordRules),
  checkCsrfToken(secret),
  isPassResetToken,
  AuthController.resetPassword,
)

router.post('/', validateWeb(AuthValidations.webLoginRules), checkCsrfToken(secret), AuthController.webLogin)

export default router

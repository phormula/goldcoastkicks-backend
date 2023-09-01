import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import CurrencyValidations from '@app/routes/validations/currency'
import CurrencyController from '@app/controllers/CurrencyController'

const router = Router()

router.route('/').get(isAuthenticated, isAdmin, CurrencyController.getAllCurrencies)
router.route('/insert-bulk').post(isAuthenticated, isAdmin, CurrencyController.addCurrenciesToDb)

router
  .route('/:id')
  .get(CurrencyController.getCurrency)
  .put(isAuthenticated, isAdmin, validate(CurrencyValidations.updateRules), CurrencyController.updateCurrency)
  .delete(isAuthenticated, isAdmin, CurrencyController.deleteCurrency)

router.post(
  '/create',
  isAuthenticated,
  isAdmin,
  validate(CurrencyValidations.createRules),
  CurrencyController.createCurrency,
)

router.post(
  '/convert',
  isAuthenticated,
  isAdmin,
  validate(CurrencyValidations.convertRules),
  CurrencyController.convert,
)

export default router

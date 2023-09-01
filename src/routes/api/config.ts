import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import ConfigController from '@app/controllers/ConfigController'
import ConfigValidations from '@routes/validations/config'

const router = Router()

router.route('/').get(isAuthenticated, isAdmin, ConfigController.getAllConfigs)

router.get('/bykey', isAuthenticated, isAdmin, ConfigController.getConfigByKey)
router.get('/by-keys', isAuthenticated, isAdmin, ConfigController.getConfigByKeys)
router
  .route('/:id')
  .get(isAuthenticated, isAdmin, ConfigController.getConfig)
  .put(isAuthenticated, isAdmin, validate(ConfigValidations.updateRules), ConfigController.updateConfig)
  .delete(isAuthenticated, isAdmin, ConfigController.deleteConfig)

router.post('/create', isAuthenticated, isAdmin, validate(ConfigValidations.createRules), ConfigController.createConfig)

export default router

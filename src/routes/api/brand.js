import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import BrandController from '@app/controllers/BrandController'
import BrandValidations from '@routes/validations/brand'

const router = Router()

router.route('/').get(BrandController.getAllBrands)

router
  .route('/:id')
  .get(BrandController.getBrand)
  .put(isAuthenticated, isAdmin, validate(BrandValidations.updateRules), BrandController.updateBrand)
  .delete(isAuthenticated, isAdmin, BrandController.deleteBrand)

router.post('/create', isAuthenticated, isAdmin, validate(BrandValidations.createRules), BrandController.createBrand)

export default router

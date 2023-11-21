import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import BrandController from '@app/controllers/BrandController'
import BrandValidations from '@app/routes/validations/brand'
import { upload } from '@app/middleware/upload'

const router = Router()

router.route('/').get(BrandController.getAllBrands)

router
  .route('/:id')
  .get(BrandController.getBrand)
  .put(
    isAuthenticated,
    isAdmin,
    upload.single('image'),
    validate(BrandValidations.updateRules),
    BrandController.updateBrand,
  )
  .delete(isAuthenticated, isAdmin, BrandController.deleteBrand)

router.post(
  '/create',
  isAuthenticated,
  isAdmin,
  upload.single('image'),
  validate(BrandValidations.createRules),
  BrandController.createBrand,
)

export default router

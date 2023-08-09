import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import ProductController from '@app/controllers/ProductController'
import ProductValidations from '@routes/validations/product'
import { upload } from '@app/middleware/upload'

const router = Router()

router.route('/').get(ProductController.getAllProducts)

router.route('/:id').get(ProductController.getProduct)

router.post(
  '/create',
  isAuthenticated,
  isAdmin,
  upload.single('image'),
  validate(ProductValidations.createRules),
  ProductController.createProduct,
)
router.post(
  '/gallery/create',
  isAuthenticated,
  isAdmin,
  upload.array('images', 10),
  validate(ProductValidations.createGalleryRules),
  ProductController.createProductGallery,
)

export default router

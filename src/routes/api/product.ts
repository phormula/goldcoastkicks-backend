import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import ProductController from '@app/controllers/ProductController'
import ProductValidations from '@routes/validations/product'
import { upload } from '@app/middleware/upload'
import ConfigController from '@app/controllers/ConfigController'

const router = Router()

router.route('/').get(ProductController.getAllProducts)
router.route('/price-filter').get(ProductValidations.filterRules, ConfigController.getConfigByKey)
router.route('/prefilters').get(ProductController.prefilters)

router.route('/:id').get(ProductController.getProduct)

router.post(
  '/create',
  isAuthenticated,
  isAdmin,
  upload.single('image'),
  validate(ProductValidations.createRules),
  ProductController.createProduct,
)

router.put(
  '/update/:id',
  isAuthenticated,
  isAdmin,
  upload.single('image'),
  validate(ProductValidations.updateRules),
  ProductController.updateProduct,
)

router.delete('/delete/:id', isAuthenticated, isAdmin, ProductController.deleteProduct)

router.post(
  '/gallery/create',
  isAuthenticated,
  isAdmin,
  upload.array('images', 10),
  validate(ProductValidations.createGalleryRules),
  ProductController.createProductGallery,
)

router.put(
  '/gallery/update',
  isAuthenticated,
  isAdmin,
  upload.array('images', 10),
  validate(ProductValidations.updateGalleryRules),
  ProductController.updateProductGallery,
)

router.post(
  '/financial/create',
  isAuthenticated,
  isAdmin,
  validate(ProductValidations.createFinancialRules),
  ProductController.createProductFinancial,
)

router.put(
  '/financial/update',
  isAuthenticated,
  isAdmin,
  validate(ProductValidations.updateFinancialRules),
  ProductController.updateProductFinancial,
)

export default router

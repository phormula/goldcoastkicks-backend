import { Router } from 'express'
import AuthController from '@app/controllers/AuthController'
import AuthValidations from '@routes/validations/auth'
import {
  getAllVendors,
  getVendor,
  register,
  addManager,
} from '@app/controllers/VendorController'
import { validate } from '@app/middleware'
const router = Router()

router.route('/all').get(getAllVendors)

router.route('/:id').get(getVendor)

router.post(
  '/register',
  validate(AuthValidations.vendorRegisterRules),
  register,
)
router.post(
  '/addmanager',
  validate(AuthValidations.vendorManagerRules),
  addManager,
)

export default router

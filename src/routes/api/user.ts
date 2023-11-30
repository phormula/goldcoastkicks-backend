import { Router } from 'express'
import UserController from '@app/controllers/UserController'
import { checkAdminOrOwner, isAdmin, isAuthenticated, validate } from '@app/middleware'
import UserValidations from '@routes/validations/user'
import User from '@app/model/User'

const router = Router()

router.route('/').get(isAuthenticated, isAdmin, UserController.getAllUsers)
router.route('/roles').get(isAuthenticated, isAdmin, UserController.getUserRoles)

router
  .route('/address')
  .get(
    isAuthenticated,
    checkAdminOrOwner(User, 'id'),
    validate(UserValidations.getAddressRules),
    UserController.getAllUserAddress,
  )
router
  .route('/address/:id')
  .get(isAuthenticated, checkAdminOrOwner(User, 'id'), UserController.getUserAddress)
  .put(
    isAuthenticated,
    checkAdminOrOwner(User, 'id'),
    validate(UserValidations.updateAddressRules),
    UserController.updateUserAddress,
  )
  .delete(isAuthenticated, checkAdminOrOwner(User, 'id'), UserController.deleteUserAddress)
router
  .route('/address/create')
  .post(
    isAuthenticated,
    checkAdminOrOwner(User, 'id'),
    validate(UserValidations.createAddressRules),
    UserController.createUserAddress,
  )

router
  .route('/:id')
  .get(isAuthenticated, UserController.getUser)
  .put(
    isAuthenticated,
    checkAdminOrOwner(User, 'id'),
    validate(UserValidations.updateUserRules),
    UserController.updateUser,
  )
  .delete(isAuthenticated, checkAdminOrOwner(User, 'id'), UserController.deleteUser)

export default router

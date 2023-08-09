import { Router } from 'express'
import UserController from '@app/controllers/UserController'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'

const router = Router()

router.route('/').get(isAuthenticated, isAdmin, UserController.getAllUsers)
router.route('/roles').get(isAuthenticated, isAdmin, UserController.getUserRoles)

router.route('/:id').get(UserController.getUser)

export default router

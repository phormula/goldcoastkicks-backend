import { Router } from 'express'
import {
  getAllUsers,
  getUserRoles,
  getUser,
} from '@app/controllers/UserController'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'

const router = Router()

router.route('/all').get(isAuthenticated, isAdmin, getAllUsers)
router.route('/roles').get(isAuthenticated, isAdmin, getUserRoles)
// .post(employeesController.createNewEmployee)
// .put(employeesController.updateEmployee)
// .delete(employeesController.deleteEmployee);

router.route('/:id').get(getUser)

export default router

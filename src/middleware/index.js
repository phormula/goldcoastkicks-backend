import authenticationMiddleware from '@app/middleware/authentication'
import isAuthenticated from '@app/middleware/isAuthenticated'
import isAdmin from '@app/middleware/isAdmin'
import isSuperAdmin from '@app/middleware/isSuperAdmin'
import validate from '@app/middleware/validate'
import isPassResetToken from '@app/middleware/isPassResetToken'

export default {
  authenticationMiddleware,
  isAuthenticated,
  isAdmin,
  isSuperAdmin,
  isPassResetToken,
  validate,
}

import mailHelper from '@app/helpers/mail'
import tokenHelper from '@app/helpers/token'

function protectedUser(userObj) {
  const fields = ['password', 'email_verified_at', 'updated_at']

  fields.forEach((e) => {
    delete userObj[e]
  })

  return userObj
}

function getCommonIds(arr1, arr2) {
  return arr1
    .map((e) => e.id)
    .filter((el) => arr2.map((ele) => ele.id).includes(el))
}

export default { mailHelper, tokenHelper, protectedUser, getCommonIds }

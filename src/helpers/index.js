export { sendMail as mailHelper } from '@app/helpers/mail'
export { generateToken as generateTokenHelper, verifyToken } from '@app/helpers/token'

export function protectedUser(userObj) {
  const fields = ['password', 'email_verified_at', 'updated_at']

  fields.forEach((e) => {
    delete userObj[e]
  })

  return userObj
}

export function getCommonIds(arr1, arr2) {
  return arr1.map((e) => e.id).filter((el) => arr2.map((ele) => ele.id).includes(el))
}

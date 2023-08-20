export { generateToken as generateTokenHelper, verifyToken } from '@app/helpers/token'

export function protectedUser(userObj: { [key: string]: any }) {
  const fields = ['password', 'email_verified_at', 'updated_at']

  fields.forEach((e) => {
    delete userObj[e]
  })

  return userObj
}

export function getCommonIds(arr1: any[], arr2: any[]) {
  return arr1.map((e) => e.id).filter((el) => arr2.map((ele) => ele.id).includes(el))
}

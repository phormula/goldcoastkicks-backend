import Role from '@app/model/Role'
import User from '@model/User'
export { createUniqueProductSlug } from '@app/helpers/slug'

export { generateToken as generateTokenHelper, verifyToken } from '@app/helpers/token'

export function protectedUser(userObj: { [key: string]: any }) {
  const { password, email_verified_at, ...user } = userObj

  return user
}

export function getCommonIds(arr1: any[], arr2: any[]) {
  return arr1.map((e) => e.id).filter((el) => arr2.map((ele) => ele.id).includes(el))
}

export function filterKey(arr: object[], key: string) {
  return arr.map((e) => ({ ...e, filter_key: key }))
}

export function isAdmin(user: User) {
  return user && user.roles.map((role: Role) => role.key).some((r: string) => r === 'super-admin' || r === 'admin')
}

export function modelId(model: any[]) {
  return model.map((m: any) => ({ id: Number(m) }))
}

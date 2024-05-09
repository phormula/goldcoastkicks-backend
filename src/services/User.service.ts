import { protectedUser } from '@app/helpers'
import User from '@model/User'
import Mail from '@model/Mail'
import Role from '@model/Role'
import UserAddress from '@model/UserAddress'

class UserService {
  async getAllUsers() {
    try {
      const users = await User.query().withGraphJoined('[roles(defaultSelects), address]')
      const result = users.map((u) => protectedUser(u))

      return { data: result }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async getUser(id: string | number) {
    try {
      const result = await User.query().alias('roles').findById(id).withGraphFetched('[roles(defaultSelects),address]')

      if (result) {
        return { data: protectedUser(result) }
      }

      return { data: { status: 'error', message: 'User not found' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async updateUser(id: string | number, data: { [key: string]: any }) {
    try {
      const { email, first_name, last_name, roles, is_disabled } = data
      const user = await User.query().upsertGraph(
        { id: Number(id), email, first_name, last_name, is_disabled, roles: roles.map((role: any) => ({ id: role })) },
        { relate: true, unrelate: true, noUpdate: ['roles'] },
      )

      return { data: user }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async deleteUser(id: string | number) {
    try {
      const user = await User.query().findById(Number(id))

      if (user) {
        await user.$relatedQuery('roles').unrelate()
        await user.$relatedQuery('address').unrelate()
        await user.$query().delete()

        return { data: { status: 'success', message: 'User deleted successfully' } }
      }

      return { data: { status: 'error', message: 'Error deleting user!' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async getUserRoles() {
    const roles = await Role.query().select('*')
    console.log(roles)
    return { data: roles }
  }

  async getMailTemplates() {
    try {
      const mailTemplate = await Mail.query().select('*')

      return { data: mailTemplate }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async getAllUserAddress(userId: string | number) {
    try {
      const addresses = await UserAddress.query().where({ user_id: userId })

      return { data: addresses }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async getUserAddress(id: string | number) {
    try {
      const address = await UserAddress.query().findById(id)

      if (address) return { data: { ...address } }

      return { data: { status: 'error', message: 'User address not found' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async createUserAddress(data: { [key: string]: any }) {
    try {
      const { user_id, address, house_no, town, city, region, country, is_default } = data

      const type = await UserAddress.query().insert({
        user_id,
        address,
        house_no,
        town,
        city,
        region,
        country,
        is_default,
      })

      return { data: type }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async updateUserAddress(id: string | number, data: { [key: string]: any }) {
    try {
      const { user_id, address, house_no, town, city, region, country, is_default } = data
      const userAddress = await UserAddress.query()
        .update({ user_id, address, house_no, town, city, region, country, is_default })
        .where({ id })

      return { data: userAddress }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async deleteUserAddress(id: string | number) {
    try {
      await UserAddress.query().findById(id).delete()

      return { data: { status: 'success', message: 'User address deleted successfully' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }
}

export default new UserService()

import User from '@model/User'
import protectedUser from '@app/helpers'
import AuthController from '@app/controllers/AuthController'
import Vendor from '@model/Vendor'
import Service from '@model/Service'

class VendorController {
  async register(req, res, next) {
    try {
      let addedServices = []
      const { name, category_id, description, services } = req.body
      const [token, refreshToken, registeredUSer] =
        await AuthController.register(req, res, next)
      const newServices = services.filter((s) => typeof s !== 'number')
      const existingServices = services.filter((s) => typeof s == 'number')
      const vendorServices = await Service.query().findByIds(existingServices)

      if (newServices) {
        addedServices = await Service.query().insert(newServices)
      }

      const vendor = await Vendor.query().insertGraph(
        [
          {
            user_id: registeredUSer.id,
            name,
            description,
            category_id,
            services: [...vendorServices, ...addedServices],
          },
        ],
        {
          relate: ['services'],
        },
      )
      res
        .status(201)
        .json({ token, refreshToken, ...protectedUser(registeredUSer) })
    } catch (err) {
      return next(err)
    }
  }

  async addManager(req, res, next) {
    try {
      const { email, vendor_id } = req.body
      let user = await User.query().findOne({ email })
      if (!user) {
        const [token, refreshToken, registeredUSer] =
          await AuthController.register(req, res, next)
        user = registeredUSer
      }
      const manager = await Vendor.query().upsertGraph(
        [
          {
            id: vendor_id,
            managers: [user],
          },
        ],
        {
          relate: ['managers'],
          noDelete: ['managers'],
        },
      )
      res
        .status(200)
        .json({ success: true, message: 'Manager added successfully' })
    } catch (err) {
      return next(err)
    }
  }

  async getAllVendors(req, res, next) {
    try {
      const vendors = await Vendor.query().withGraphJoined(
        '[categories, services, managers(defaultSelects)]',
      )
      res.send(vendors)
    } catch (err) {
      return next(err)
    }
  }

  async getVendor(req, res, next) {
    try {
      const vendor = await User.query().findById(req.params.id)

      if (vendor) {
        res.send(protectedUser(vendor))
      } else {
        res.send({ status: 'error', message: 'User not found' })
      }
    } catch (err) {
      return next(err)
    }
  }
}

export default new VendorController()

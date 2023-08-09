import Size from '@app/model/Size'

class SizeController {
  async getAllSizes(req, res, next) {
    try {
      const brands = await Size.query()
      res.send({ data: brands })
    } catch (err) {
      return next(err)
    }
  }

  async getSize(req, res, next) {
    try {
      const result = await Size.query().findById(req.params.id)

      if (result) {
        res.send({ data: result })
      } else {
        res.status(404).send({ status: 'error', message: 'Size not found' })
      }
    } catch (err) {
      return next(err)
    }
  }

  async createSize(req, res, next) {
    try {
      const { name, description } = req.body

      const brand = await Size.query().insert({
        name,
        description,
      })
      res.status(201).json({ data: brand })

      return product
    } catch (err) {
      next(err)
    }
  }

  updateSize(req, res, next) {
    // Update a product in the database based on the data from the request body
    const brandId = req.params.id
    Size.findByIdAndUpdate(productId, req.body, { new: true }, (err, product) => {
      if (err) {
        res.status(500).json({ error: 'An error occurred while updating the product.' })
      } else {
        res.json(product)
      }
    })
  }

  deleteSize(req, res, next) {
    // Delete a product from the database based on its ID
    const brandId = req.params.id
    Size.findByIdAndDelete(productId, (err) => {
      if (err) {
        res.status(500).json({ error: 'An error occurred while deleting the product.' })
      } else {
        res.json({ message: 'Size deleted successfully.' })
      }
    })
  }
}

export default new SizeController()

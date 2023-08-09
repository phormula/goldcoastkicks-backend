import Brand from '@app/model/Brand'

class BrandController {
  async getAllBrands(req, res, next) {
    try {
      const brands = await Brand.query()
      res.send({ data: brands })
    } catch (err) {
      return next(err)
    }
  }

  async getBrand(req, res, next) {
    try {
      const result = await Brand.query().findById(req.params.id)

      if (result) {
        res.send({ data: result })
      } else {
        res.status(404).send({ status: 'error', message: 'Brand not found' })
      }
    } catch (err) {
      return next(err)
    }
  }

  async createBrand(req, res, next) {
    try {
      const { name, description } = req.body

      const brand = await Brand.query().insert({
        name,
        description,
      })
      res.status(201).json({ data: brand })

      return product
    } catch (err) {
      next(err)
    }
  }

  updateBrand(req, res, next) {
    // Update a product in the database based on the data from the request body
    const brandId = req.params.id
    Brand.findByIdAndUpdate(productId, req.body, { new: true }, (err, product) => {
      if (err) {
        res.status(500).json({ error: 'An error occurred while updating the product.' })
      } else {
        res.json(product)
      }
    })
  }

  deleteBrand(req, res, next) {
    // Delete a product from the database based on its ID
    const brandId = req.params.id
    Brand.findByIdAndDelete(productId, (err) => {
      if (err) {
        res.status(500).json({ error: 'An error occurred while deleting the product.' })
      } else {
        res.json({ message: 'Brand deleted successfully.' })
      }
    })
  }
}

export default new BrandController()

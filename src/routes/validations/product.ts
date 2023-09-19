import { body, query } from 'express-validator'
import path from 'path'

class ProductValidations {
  createRules = [...this.productCommonRules(), this.imgRules('image')]

  updateRules = [...this.productCommonRules(), this.imgRules('image', true)]

  createGalleryRules = [body('productId').exists(), this.imgRules('images'), body('colors').isArray()]

  updateGalleryRules = [body('productId').exists(), this.imgRules('images'), body('colors').isArray()]

  createFinancialRules = [body('productId').exists(), body('profit_percent'), body('tax_percent').exists()]

  updateFinancialRules = [body('productId').exists(), body('profit_percent'), body('tax_percent').exists()]

  filterRules = [query('key').equals('price_filter').exists()]

  productCommonRules() {
    return [
      body('name').exists(),
      body('description').exists(),
      body('sku').exists(),
      body('weight').exists(),
      body('buying_price').isDecimal().exists(),
      body('selling_price').isDecimal().exists(),
      body('buying_currency_id').exists(),
      body('selling_currency_id').exists(),
      body('sizes').exists().withMessage('sizes is required').isArray().withMessage('sizes is not array'),
      body('colorways').exists().withMessage('colorways is required').isArray().withMessage('colorways is not array'),
      body('brand').exists(),
    ]
  }

  imgRules(key: string = 'image', optional = false) {
    let rule
    if (key === 'image') {
      rule = body(key).custom((value, { req }) => {
        if (!req.file) {
          throw new Error('Image field is required.')
        }
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        const fileExtension = path.extname(req.file.originalname).toLowerCase()
        if (!allowedExtensions.includes(fileExtension)) {
          throw new Error('Uploaded file is not an image.')
        }
        return true
      })
    } else {
      rule = body('images').custom((value, { req }) => {
        if (!req.files) {
          throw new Error('Image field is required.')
        }
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
        req.files.forEach((image: any) => {
          const fileExtension = path.extname(image.originalname).toLowerCase()
          if (!allowedExtensions.includes(fileExtension)) {
            throw new Error('Uploaded file is not an image.')
          }
        })
        return true
      })
    }

    if (optional) {
      return rule?.optional()
    }

    return rule
  }
}

export default new ProductValidations()

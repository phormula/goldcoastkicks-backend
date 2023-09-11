import { body } from 'express-validator'
import path from 'path'

class ProductValidations {
  createRules = [
    body('name').exists(),
    body('description').exists(),
    body('sku').exists(),
    body('image').custom((value, { req }) => {
      if (!req.file) {
        throw new Error('Image field is required.')
      }
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
      const fileExtension = path.extname(req.file.originalname).toLowerCase()
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error('Uploaded file is not an image.')
      }
      return true
    }),
    body('buying_price').isDecimal().exists(),
    body('selling_price').isDecimal().exists(),
    body('buying_currency_id').exists(),
    body('selling_currency_id').exists(),
    body('sizes').exists().withMessage('sizes is required').isArray().withMessage('sizes is not array'),
    body('colorways').exists().withMessage('colorways is required').isArray().withMessage('colorways is not array'),
    body('brand').isInt().optional(),
  ]

  updateRules = [
    body('name').exists(),
    body('description').exists(),
    body('sku').exists(),
    body('image')
      .optional()
      .custom((value, { req }) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
        const fileExtension = path.extname(req.file.originalname).toLowerCase()
        if (!allowedExtensions.includes(fileExtension)) {
          throw new Error('Uploaded file is not an image.')
        }
        return true
      }),
    body('buying_price').isDecimal().exists(),
    body('selling_price').isDecimal().exists(),
    body('buying_currency_id').exists(),
    body('selling_currency_id').exists(),
    body('sizes').exists().withMessage('sizes is required').isArray().withMessage('sizes is not array'),
    body('colorways').exists().withMessage('colorways is required').isArray().withMessage('colorways is not array'),
    body('brand').exists(),
    body('type').exists().isArray(),
    body('position').exists().isArray(),
    body('court').exists().isArray(),
  ]

  createGalleryRules = [
    body('productId').exists(),
    body('images').custom((value, { req }) => {
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
    }),
  ]

  updateGalleryRules = [
    body('productId').exists(),
    body('images').custom((value, { req }) => {
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
    }),
  ]
}

export default new ProductValidations()

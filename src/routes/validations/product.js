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
    body('price').isDecimal().exists(),
    body('sizes').exists().withMessage('sizes is required').isArray().withMessage('sizes is not array'),
    body('colorway').isInt().exists(),
    body('brand').isInt().optional(),
  ]

  createGalleryRules = [
    body('productId').exists(),
    body('images').custom((value, { req }) => {
      if (!req.files) {
        throw new Error('Image field is required.')
      }
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
      req.files.forEach((image) => {
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

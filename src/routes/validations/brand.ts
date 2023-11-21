import { body } from 'express-validator'
import path from 'path'

class BrandValidations {
  image = body('image')
    .optional()
    .custom((_, { req }) => {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
      const fileExtension = path.extname(req.file.originalname).toLowerCase()
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error('Uploaded file is not an image.')
      }
      return true
    })
  createRules = [body('name').exists(), this.image, body('description').optional()]

  updateRules = [body('name').exists(), this.image, body('description').optional()]
}

export default new BrandValidations()

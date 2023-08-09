import multer from 'multer'
import path from 'path'

export const upload = multer({
  storage: multer.diskStorage({
    destination: 'src/resources/static/assets/uploads/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const extension = path.extname(file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix + extension)
    },
  }),
})

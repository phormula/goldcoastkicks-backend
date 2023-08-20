import { Request } from 'express'
import multer from 'multer'
import path from 'path'

export const upload = multer({
  storage: multer.diskStorage({
    // destination: 'src/resources/static/assets/uploads/',
    destination: (req, file, cb) => {
      const destinationPath = path.join(__dirname, 'resources', 'static', 'assets', 'uploads') // Change 'uploads' to your desired folder name
      cb(null, destinationPath)
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const extension = path.extname(file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix + extension)
    },
  }),
})

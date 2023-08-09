import { upload } from '@app/helpers'

class UploadController {
  async upload(req, res) {
    try {
      upload.single('image')(req, res, (err) => {
        if (req.file == undefined) {
          return res.status(400).send({ message: 'Please upload a file!' })
        }
        if (err) {
          return res.status(400).json({ error: 'Failed to upload image.' })
        }
        const imagePath = req.file.path

        return res.json({ imagePath })
      })
    } catch (err) {
      res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      })
    }
  }

  getListFiles(req, res) {
    const directoryPath = __basedir + '/resources/static/assets/uploads/'

    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        res.status(500).send({
          message: 'Unable to scan files!',
        })
      }

      let fileInfos = []

      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: baseUrl + file,
        })
      })

      res.status(200).send(fileInfos)
    })
  }

  download(req, res) {
    const fileName = req.params.name
    const directoryPath = __basedir + '/resources/static/assets/uploads/'

    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: 'Could not download the file. ' + err,
        })
      }
    })
  }
}

export default new UploadController()

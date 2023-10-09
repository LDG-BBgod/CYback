const express = require('express')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const { Hospital } = require('../api')

const router = express.Router()

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'upload/hospital/')
    },
    filename(req, file, done) {
      done(null, Date.now() + '-' + uuidv4() + '-' + file.originalname)
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10메가로 용량 제한
})
router.post('/create', Hospital.hospitalCreate)
// router.post('/update', upload.array('images'), Hospital.hospitalUpdate)


module.exports = router

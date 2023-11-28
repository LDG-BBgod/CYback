const express = require('express')
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const { Hospital } = require('../api')

const router = express.Router()

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, path.join(__dirname, '../../upload/'))
    },
    filename(req, file, done) {
      done(null, Date.now() + '-' + uuidv4() + '^' + file.originalname)
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10메가로 용량 제한
  fileFilter(req, file, done) {
    if (file.mimetype.lastIndexOf('image') > -1) {
      //파일 허용
      done(null, true)
    } else {
      //파일 거부
      done(null, false)
    }
  },
})
router.post('/create', Hospital.hospitalCreate)
router.post('/members', Hospital.hospitalMember)
router.post('/read', Hospital.hospitalRead)

router.post(
  '/updateImgIntro',
  upload.array('images'),
  Hospital.hospitalUpdateImgIntro
)
router.post('/update', Hospital.hospitalUpdate)
router.post('/updateImgIntro', upload.array('images'))

router.post('/emailVerify', Hospital.hospitalEmailVerify)
router.post('/emailCheck', Hospital.hospitalEmailCheck)
router.post('/phoneVerify', Hospital.hospitalPhoneVerify)
router.post('/phoneCheck', Hospital.hospitalPhoneCheck)

module.exports = router

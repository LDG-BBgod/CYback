const express = require('express')
const { Hospital, Center } = require('../mongoose/model')
const { checkToken, getToken } = require('../api/token')

const router = express.Router()

router.post('/login', async (req, res) => {
  const { id, pw } = req.body
  const resContent = {
    err: false,
    msg: {
      success: false
    },
  }
  const isExistHospital = await Hospital.findOne({ userId: id })
  const isExistCenter = await Center.findOne({ userId: id })
  if (isExistHospital) {
    if (isExistHospital.authenticate(pw)) {
      const token = getToken(id)
      isExistHospital.token = token
      await isExistHospital.save()
      resContent.msg = {
        success: true,
        type: 'hospital',
        id,
        token,
      }
    } else {
      resContent.msg = {
        success: false
      }
    }
  } else if (isExistCenter) {
    if (isExistCenter.authenticate(pw)) {
      const token = getToken(id)
      isExistCenter.token = token
      await isExistCenter.save()
      resContent.msg = {
        success: true,
        type: 'center',
        id,
        token,
      }
    } else {
      resContent.msg = {
        success: false
      }
    }
  }
  res.send(resContent)
})

module.exports = router

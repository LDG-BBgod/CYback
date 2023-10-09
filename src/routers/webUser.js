const express = require('express')
const { Hospital, Center } = require('../mongoose/model')
const { checkToken, getToken } = require('../api/token')

const router = express.Router()

router.post('/login', async (req, res) => {
  console.log('post webUser/login')

  const { id, pw } = req.body
  const resContent = {
    err: false,
    msg: {
      success: false,
    },
  }
  console.log(Hospital)
  // let isExistHospital = null
  // try {
  //   isExistHospital = await Hospital.findOne({ userId: id })
  // } catch (err) {
  //   console.log(err)
  // }

  // const isExistCenter = await Center.findOne({ userId: id })
  // console.log(isExistHospital)
  // if (isExistHospital) {
  //   if (isExistHospital.authenticate(pw)) {
  //     const token = getToken(id)
  //     isExistHospital.token = token
  //     await isExistHospital.save()
  //     resContent.msg = {
  //       success: true,
  //       type: 'hospital',
  //       id,
  //       token,
  //     }
  //   } else {
  //     resContent.msg = {
  //       success: false,
  //     }
  //   }
  // } else if (isExistCenter) {
  //   if (isExistCenter.authenticate(pw)) {
  //     const token = getToken(id)
  //     isExistCenter.token = token
  //     await isExistCenter.save()
  //     resContent.msg = {
  //       success: true,
  //       type: 'center',
  //       id,
  //       token,
  //     }
  //   } else {
  //     resContent.msg = {
  //       success: false,
  //     }
  //   }
  // }
  res.send(resContent)
})

module.exports = router

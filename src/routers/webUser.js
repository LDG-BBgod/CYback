const express = require('express')
const { Hospital, HospitalMember } = require('../mongoose/model')
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

  // 병원, 센터, 각각의 간호사들 어떻게 구분할건지 로그인 로직 재작성
  const isExistHospital = await Hospital.findOne({ userId: id })
  const isExistMember = await HospitalMember.findOne({ userId: id })

  if (isExistHospital) {
    if (
      isExistHospital.authenticate(pw) &&
      isExistHospital.allowed === 'true'
    ) {
      const token = getToken(id)
      isExistHospital.token = token
      await isExistHospital.save()

      const OID = isExistHospital._id
      const existtMember = await HospitalMember.find({ hospital: OID })
      if (existtMember.length > 0) {
        await HospitalMember.updateMany({ hospital: OID }, { $set: { token } })
      }

      resContent.msg = {
        success: true,
        type: 'leader',
        OID: OID,
        id,
        token,
      }
    } else {
      resContent.msg = {
        success: false,
      }
    }
  } else if (isExistMember) {
    if (isExistMember.authenticate(pw) && isExistMember.allowed === 'true') {
      const existHospital = await Hospital.findOne({
        _id: isExistMember.hospital,
      })
      const token = existHospital.token
      isExistMember.token = token
      await isExistMember.save()
      resContent.msg = {
        success: true,
        type: 'member',
        OID: existHospital._id,
        id: existHospital.userId,
        token
      }
    } else {
      resContent.msg = {
        success: false,
      }
    }
  } else {
    resContent.msg = {
      success: false,
    }
  }
  res.send(resContent)
})

module.exports = router

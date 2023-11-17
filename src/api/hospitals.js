const fs = require('fs')
const { Hospital, Center } = require('../mongoose/model')
const { checkToken, getToken } = require('./token')

const hospitalCreate = async (req, res) => {
  console.log('post hospital/create')

  const {
    id,
    pw,
    hospitalName,
    doctorName,
    license,
    address1,
    address2,
    address3,
    bn,
    email,
  } = req.body
  const isExist1 = await Hospital.findOne({ userId: id })
  const isExist2 = await Center.findOne({ userId: id })

  if (isExist1 || isExist2) {
    const resContent = {
      err: false,
      msg: {
        isExist: true,
      },
    }
    res.send(resContent)
  } else {
    const newHostpital = await Hospital({
      userId: id,
      password: pw,
      hospitalName,
      doctorName,
      license,
      address1,
      address2,
      address3,
      bn,
      email,
    })
    try {
      await newHostpital.save()
      const resContent = {
        err: false,
        msg: {
          isExist: false,
        },
      }
      res.send(resContent)
    } catch (err) {
      console.log(err)
      const resContent = {
        err: true,
        msg: {},
      }
      res.send(resContent)
    }
  }
}

const hospitalRead = async (req, res) => {
  console.log('post hospital/read')

  const { userId, token } = req.body
  const hospital = await Hospital.findOne({ userId })
  if (checkToken(token, hospital.token)) {
    const resContent = {
      err: false,
      msg: {
        success: true,
        hospitalName: hospital.hospitalName,
        doctorName: hospital.doctorName,
        address1: hospital.address1,
        address2: hospital.address2,
        address3: hospital.address3,
        bn: hospital.bn,
        email: hospital.email,
        imageUrls: hospital.imageUrls,
        introduction: hospital.introduction,

        initSetting: hospital.initSetting,
      },
    }
    res.send(resContent)
  } else {
    const resContent = {
      err: false,
      msg: {
        success: false,
      },
    }
    res.send(resContent)
  }
}

const hospitalUpdateImgIntro = async (req, res) => {
  console.log('post hospital/updateImgIntro')

  const { userId, token, introduction } = JSON.parse(req.body.jsonField)
  const imageUrls = req.files.map((file) =>
    file.path.substring(file.path.indexOf('upload'))
  )
  const hospital = await Hospital.findOne({ userId })

  if (checkToken(token, hospital.token)) {
    const oldImageUrls = hospital.imageUrls || []
    if (oldImageUrls.length > 0) {
      for (const oldImageUrl of oldImageUrls) {
        try {
          fs.unlinkSync(oldImageUrl)
        } catch (err) {
          console.error(`삭제실패`)
        }
      }
    }
    hospital.introduction = introduction
    hospital.imageUrls = imageUrls
    await hospital.save()
    const resContent = {
      err: false,
      msg: {
        success: true,
      },
    }
    res.send(resContent)
  } else {
    const resContent = {
      err: false,
      msg: {
        success: false,
      },
    }
    res.send(resContent)
  }
}

const hospitalUpdate = async (req, res) => {
  console.log('post hospital/update')

  let resContent = {
    err: false,
    msg: {
      success: true,
    },
  }
  const { userId, token, type } = req.body
  const hospital = await Hospital.findOne({ userId })
  if (checkToken(token, hospital.token)) {
    switch (type) {
      case 'initSetting':
        hospital.initSetting = 'true'
        await hospital.save()
        break
      default:
        break
    }
  } else {
    resContent.err = true
  }
  res.send(resContent)
}

module.exports = {
  hospitalCreate,
  hospitalRead,
  hospitalUpdateImgIntro,
  hospitalUpdate,
}

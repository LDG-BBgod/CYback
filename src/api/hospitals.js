const fs = require('fs')
const path = require('path')
const NodeCache = require('node-cache')
const { Hospital, HospitalMember } = require('../mongoose/model')
const { sendEmail, sendAddMembers } = require('./sendEmail')
const { sendSENS } = require('./sens')
const { checkToken, getToken } = require('./token')

const hospitalCache = new NodeCache({ stdTTL: 600 })

const hospitalCreate = async (req, res) => {
  console.log('post hospital/create')

  const {
    id,
    pw,
    hospitalType,
    hospitalName,
    address1,
    address2,
    address3,
    hospitalPhone,
    bn,
    doctorName,
    licenseType,
    license,
    doctorPhone,
    email,
  } = req.body
  const isExistHospital = await Hospital.findOne({ userId: id })
  const isExistMember = await HospitalMember.findOne({ userId: id })

  if (isExistHospital || isExistMember) {
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
      hospitalType,
      hospitalName,
      address1,
      address2,
      address3,
      hospitalPhone,
      bn,
      doctorName,
      licenseType,
      license,
      doctorPhone,
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

  const { OID } = req.body
  const hospital = await Hospital.findOne({ _id: OID })
  const resContent = {
    err: false,
    msg: {
      success: true,
      hospitalType: hospital.hospitalType,
      hospitalName: hospital.hospitalName,
      address1: hospital.address1,
      address2: hospital.address2,
      address3: hospital.address3,
      hospitalPhone: hospital.hospitalPhone,
      bn: hospital.bn,
      doctorName: hospital.doctorName,
      licenseType: hospital.licenseType,
      license: hospital.license,
      doctorPhone: hospital.doctorPhone,
      email: hospital.email,

      isReserveSetted: hospital.isReserveSetted,
      initSetting: hospital.initSetting,
      introduction: hospital.introduction,
      imageUrls: hospital.imageUrls,

      timeSection: hospital.timeSection,
      daySH: hospital.daySH,
      daySM: hospital.daySM,
      dayEH: hospital.dayEH,
      dayEM: hospital.dayEM,
      skipWeek1: hospital.skipWeek1,
      week1SH: hospital.week1SH,
      week1SM: hospital.week1SM,
      week1EH: hospital.week1EH,
      week1EM: hospital.week1EM,
      skipWeek2: hospital.skipWeek2,
      week2SH: hospital.week2SH,
      week2SM: hospital.week2SM,
      week2EH: hospital.week2EH,
      week2EM: hospital.week2EM,
      skipLunch: hospital.skipLunch,
      lunchSH: hospital.lunchSH,
      lunchSM: hospital.lunchSM,
      lunchEH: hospital.lunchEH,
      lunchEM: hospital.lunchEM,
    },
  }
  res.send(resContent)
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
        const removeUrl = path.join(__dirname, '../../', oldImageUrl)
        try {
          fs.unlinkSync(removeUrl)
        } catch (err) {
          console.error(`삭제기능오류`)
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
        const {
          timeSection,
          daySH,
          daySM,
          dayEH,
          dayEM,
          skipWeek1,
          week1SH,
          week1SM,
          week1EH,
          week1EM,
          skipWeek2,
          week2SH,
          week2SM,
          week2EH,
          week2EM,
          skipLunch,
          lunchSH,
          lunchSM,
          lunchEH,
          lunchEM,
        } = req.body.data
        hospital.initSetting = 'true'
        hospital.isReserveSetted = 'true'
        hospital.timeSection = timeSection
        hospital.daySH = daySH
        hospital.daySM = daySM
        hospital.dayEH = dayEH
        hospital.dayEM = dayEM
        hospital.skipWeek1 = String(skipWeek1)
        hospital.week1SH = week1SH
        hospital.week1SM = week1SM
        hospital.week1EH = week1EH
        hospital.week1EM = week1EM
        hospital.skipWeek2 = String(skipWeek2)
        hospital.week2SH = week2SH
        hospital.week2SM = week2SM
        hospital.week2EH = week2EH
        hospital.week2EM = week2EM
        hospital.skipLunch = String(skipLunch)
        hospital.lunchSH = lunchSH
        hospital.lunchSM = lunchSM
        hospital.lunchEH = lunchEH
        hospital.lunchEM = lunchEM
        await hospital.save()
        break
      case 'initSettingSkip':
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

// 병원구성원 추가
const hospitalMember = async (req, res) => {
  console.log('post hospital/members')
  const { userId, token, emails } = req.body

  let resContent = {
    err: false,
    msg: {
      success: true,
    },
  }
  const hospital = await Hospital.findOne({ userId })
  if (checkToken(token, hospital.token)) {
    const hospitalOID = hospital._id
    emails.forEach(async (email) => {
      await sendAddMembers(email, hospitalOID)
    })
  } else {
    resContent.err = true
  }

  res.send(resContent)
}

// 병원 이메일 및 휴대폰 인증
const hospitalEmailVerify = async (req, res) => {
  console.log('post hospital/emailVerify')

  const { email } = req.body
  const verificationCode = Math.floor(100000 + Math.random() * 900000)

  hospitalCache.set(email, verificationCode)

  await sendEmail(email, verificationCode)

  const resContent = {
    err: false,
    msg: {},
  }
  res.send(resContent)
}

const hospitalEmailCheck = async (req, res) => {
  console.log('post hospital/emailCheck')

  const { email, verificationCode } = req.body
  const cachedCode = hospitalCache.get(email)

  let resContent = {
    err: false,
    msg: {},
  }

  if (cachedCode && cachedCode === Number(verificationCode)) {
    // 인증번호가 일치하는 경우
    resContent.msg = {
      match: true,
    }
  } else {
    // 인증번호가 일치하지 않는 경우
    resContent.msg = {
      match: false,
    }
  }
  res.send(resContent)
}

const hospitalPhoneVerify = async (req, res) => {
  console.log('post hospital/phoneVerify')

  const { doctorPhone } = req.body
  const verificationCode = Math.floor(100000 + Math.random() * 900000)

  hospitalCache.set(doctorPhone, verificationCode)

  await sendSENS(doctorPhone, verificationCode)

  const resContent = {
    err: false,
    msg: {},
  }
  res.send(resContent)
}

const hospitalPhoneCheck = async (req, res) => {
  console.log('post hospital/phoneCheck')

  const { doctorPhone, verificationCode } = req.body
  const cachedCode = hospitalCache.get(doctorPhone)

  let resContent = {
    err: false,
    msg: {},
  }

  if (cachedCode && cachedCode === Number(verificationCode)) {
    // 인증번호가 일치하는 경우
    resContent.msg = {
      match: true,
    }
  } else {
    // 인증번호가 일치하지 않는 경우
    resContent.msg = {
      match: false,
    }
  }
  res.send(resContent)
}

// App용
const hospitalList = async (req, res) => {
  console.log('post hospital/hospitalList')

  let resContent = {
    err: false,
    msg: {},
  }
  try {
    const hospitalArr = await Hospital.find().select(
      'hospitalName hospitalPhone address1 address2 address3 imageUrls'
    )
    resContent.msg.list = hospitalArr
  } catch (err) {
    resContent.err = true
  }
  res.send(resContent)
}
const hospitalInfo = async (req, res) => {
  console.log('post hospital/hospitalInfo')

  const { OID } = req.body
  let resContent = {
    err: false,
    msg: {},
  }
  try {
    const hospitalData = await Hospital.findOne({ _id: OID }).select(
      'imageUrls hospitalName address2 address3 hospitalPhone introduction doctorName licenseType isReserveSetted'
    )
    resContent.msg.data = hospitalData
  } catch (err) {
    resContent.err = true
  }
  res.send(resContent)
}

const hospitalTimeTable = async (req, res) => {
  console.log('post hospital/hospitalTimeTable')

  const { OID } = req.body
  let resContent = {
    err: false,
    msg: {},
  }
  try {
    const hospitalData = await Hospital.findOne({ _id: OID }).select(
      'timeSection daySH daySM dayEH dayEM skipWeek1 week1SH week1SM week1EH week1EM skipWeek2 week2SH week2SM week2EH week2EM skipLunch lunchSH lunchSM lunchEH lunchEM'
    )
    resContent.msg.data = hospitalData
  } catch (err) {
    resContent.err = true
  }
  res.send(resContent)
}

module.exports = {
  // Web
  hospitalCreate,
  hospitalMember,
  hospitalRead,
  hospitalUpdateImgIntro,
  hospitalUpdate,
  // App
  hospitalList,
  hospitalInfo,
  hospitalTimeTable,
  // 이메일, 핸드폰 인증
  hospitalEmailVerify,
  hospitalEmailCheck,
  hospitalPhoneVerify,
  hospitalPhoneCheck,
}

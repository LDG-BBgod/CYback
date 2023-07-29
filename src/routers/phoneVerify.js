// @ts-check
const express = require('express')
const NodeCache = require('node-cache')
const { SENS } = require('../api/index')
const { User } = require('../mongoose/model')
const { getToken } = require('../api/token')

const router = express.Router()
const cache = new NodeCache({ stdTTL: 180 })

router.get('/', async (req, res) => {
  res.send('/phone url get접속성공')
})
router.post('/', async (req, res) => {
  res.send('/phone url post접속성공')
})

router.post('/verify', async (req, res) => {
  console.log('post phone/verify')
  const phoneNumber = req.body.phone

  const verificationCode = Math.floor(100000 + Math.random() * 900000)

  cache.set(phoneNumber, verificationCode)

  await SENS.sendSENS(phoneNumber, verificationCode)

  const resContent = {
    err: false,
    msg: {},
  }

  res.send(resContent)
})

router.post('/check', async (req, res) => {
  console.log('post phone/check')
  const phoneNumber = req.body.phone
  const verificationCode = req.body.authNum
  const cachedCode = cache.get(phoneNumber)

  if (cachedCode && cachedCode === Number(verificationCode)) {
    // 인증번호가 일치하는 경우
    const user = await User.findOne({ phone: phoneNumber })
    const token = getToken(phoneNumber)

    user.token = token
    await user.save()

    const resContent = {
      err: false,
      msg: {
        match: true,
        phone: user.phone,
        token: token,
      },
    }
    res.send(resContent)
  } else {
    // 인증번호가 일치하지 않는 경우
    const resContent = {
      err: false,
      msg: {
        match: false,
      },
    }
    res.send(resContent)
  }
})

module.exports = router

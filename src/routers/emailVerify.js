// @ts-check
const express = require('express')
const NodeCache = require('node-cache')
const { User } = require('../mongoose/model')
const { SENDEMAIL } = require('../api/index')
const nodemailer = require('nodemailer')

const router = express.Router()
const cache = new NodeCache({ stdTTL: 600 })

router.post('/verify', async (req, res) => {
  console.log('post email/verify')
  const email = req.body.email

  const verificationCode = Math.floor(100000 + Math.random() * 900000)

  cache.set(email, verificationCode)

  await SENDEMAIL.sendEmail(email, verificationCode)

  const resContent = {
    err: false,
    msg: {},
  }
  res.send(resContent)
})

router.post('/check', async (req, res) => {
  console.log('post email/check')
  const email = req.body.email
  const phoneNumber = req.body.phone
  const verificationCode = req.body.authNum
  const cachedCode = cache.get(email)

  let resContent = {
    err: false,
    msg: {},
  }

  if (cachedCode && cachedCode === Number(verificationCode)) {
    // 인증번호가 일치하는 경우
    const user = await User.findOne({ phone: phoneNumber })
    user.email = email
    user.emailVerify = 'true'
    await user.save()
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
})
module.exports = router

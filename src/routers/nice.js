// @ts-check
const express = require('express')

const router = express.Router()

const { NICE } = require('../api/index')

router.post('/auth', async (req, res) => {
  const resData = await NICE.getTEIData()
  res.json(resData)
})

router.post('/decrypt', async (req, res) => {
  const data = await NICE.decryptURL(req.body.url)
  const resData = {
    name: data.name,
    birth: data.birthdate.slice(-6),
    gender: data.gender,
    mobileNo: data.mobile_no,
  }
  res.json(resData)
})

module.exports = router

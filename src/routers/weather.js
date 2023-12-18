// @ts-check
const express = require('express')
const crypto = require('crypto')
const axios = require('axios')
const router = express.Router()

function getSigningKey(timestamp, ip) {
  const AccessKey = 'hUDGEbwWOEheQPnnfsE9'
  const SecretKey = 'XKIKmPmVGNHnkOcFtDEldmiZ52eExx2K0biFfYsE'
  const method = 'GET'
  const uri = `/geolocation/v2/geoLocation?ip=${ip}&ext=t&responseFormatType=json`

  const message = `${method} ${uri}\n${timestamp}\n${AccessKey}`
  const signingKey = crypto
    .createHmac('sha256', SecretKey)
    .update(message)
    .digest('base64')

  return signingKey
}

router.get('/getLocalWeather', async (req, res) => {
  console.log('get weather/getLocalWeather')

  let resContent = {
    err: false,
    msg: {},
  }
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const timestamp = Date.now().toString()
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'x-ncp-apigw-timestamp': timestamp,
    'x-ncp-iam-access-key': 'hUDGEbwWOEheQPnnfsE9',
    'x-ncp-apigw-signature-v2': getSigningKey(timestamp, userIP),
  }
  try {
    const geolocationRes = await axios.get(
      `https://geolocation.apigw.ntruss.com/geolocation/v2/geoLocation?ip=${userIP}&ext=t&responseFormatType=json`,
      { headers }
    )
    const { lat, long } = geolocationRes.data.geoLocation

    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=e7e9d7b3fd059da1c7d2afa7def8ae46&units=metric`
    )
    console.log(weatherRes.data.weather[0].main)
    resContent.msg.weather = weatherRes.data.weather[0].main // weather = Clear, Rain, Snow, Clouds, others...
  } catch (err) {
    console.error('지역날씨 가져오기 실패')
    resContent.err = true
  }

  res.json(resContent)
})

module.exports = router

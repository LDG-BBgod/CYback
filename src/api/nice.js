const crypto = require('crypto')
const axios = require('axios')
const NodeCache = require('node-cache')
const iconv = require('iconv-lite')
const { cryptoToken } = require('./niceManager')

const cache = new NodeCache({ stdTTL: 4200 })

// 토큰 발급, 유효기간 50년 (실사용X)
async function getOauthToken() {
  try {
    const url =
      'https://svc.niceapi.co.kr:22001/digital/niceid/oauth/oauth/token'

    const clientId = 'b6f3c52a-e67a-4bd6-93a2-d142dc1364d9'
    const clientSecret = '8f842b9199d718f4e883e0bc27eb61f540761e0'
    const authString = 'Basic ' + btoa(`${clientId}:${clientSecret}`)
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authString,
    }

    const bodyData = 'grant_type=client_credentials&scope=default'

    await axios.post(url, bodyData, { headers }).then((res) => {
      console.log(res.data)
    })
  } catch (err) {
    console.error(err)
  }
}

async function getEncryptOauthToken() {
  // 암호화토큰 발급
  const url =
    'https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/common/crypto/token'

  const accessToken = '55d0164f-f0dc-4cd2-8c5a-dbe0b84d1b55'
  const clientId = 'b6f3c52a-e67a-4bd6-93a2-d142dc1364d9'
  const currentDate = new Date()
  const current_timestamp = currentDate.getTime()
  const authString =
    'bearer ' + btoa(`${accessToken}:${current_timestamp}:${clientId}`)
  const headers = {
    'Content-Type': 'application/json',
    Authorization: authString,
    client_id: clientId,
    ProductID: '2101979031',
  }

  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  const hours = String(currentDate.getHours()).padStart(2, '0')
  const minutes = String(currentDate.getMinutes()).padStart(2, '0')
  const seconds = String(currentDate.getSeconds()).padStart(2, '0')

  const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`
  const reqDtim = formattedDateTime
  const reqNo = 'chiyoom' + formattedDateTime
  const bodyData = {
    dataHeader: { CNTY_CD: 'ko' },
    dataBody: {
      req_dtim: reqDtim,
      req_no: reqNo,
      enc_mode: '1',
    },
  }

  let resData = null
  try {
    await axios.post(url, bodyData, { headers }).then((res) => {
      resData = res.data.dataBody
    })
  } catch (err) {
    console.error(err)
  }
  // 대칭키 생성
  const myValue = reqDtim.trim() + reqNo.trim() + resData.token_val.trim()
  const hash = crypto.createHash('sha256').update(myValue).digest('base64')
  const key = hash.slice(0, 16)
  const hmacKey = hash.slice(0, 32)
  const iv = hash.slice(hash.length - 16)

  // 요청데이터 암호화
  const reqData = JSON.stringify({
    requestno: reqNo,
    returnurl: 'https://www.chiyoom.com',
    businessno: '8238102958',
    sitecode: resData.site_code,
    methodtype: 'get',
    popupyn: 'N',
    authtype: 'M',
  })
  const keyBuffer = Buffer.from(key, 'utf-8')
  const ivBuffer = Buffer.from(iv, 'utf-8')

  const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, ivBuffer)
  cipher.setAutoPadding(true)
  let encData = cipher.update(reqData, 'utf-8', 'base64')
  encData += cipher.final('base64')

  function hmac256(secretKey, message) {
    try {
      const hmac = crypto.createHmac('sha256', secretKey)
      hmac.update(message)
      return hmac.digest()
    } catch (error) {
      throw new Error('Failed to generate HMACSHA256 encrypt')
    }
  }
  const hmacSha256 = hmac256(Buffer.from(hmacKey), Buffer.from(encData))
  const integrityValue = hmacSha256.toString('base64')

  const tokenVersionId = resData.token_version_id

  const returnData = {
    tokenVersionId,
    encData,
    integrityValue,
  }

  const issdate = new Date()
  cryptoToken.setTokenVersionId(tokenVersionId)
  cryptoToken.setEncData(encData)
  cryptoToken.setIntegrityValue(integrityValue)
  cryptoToken.setPeriod(resData.period * 1000)
  cryptoToken.setIssDate(issdate.getTime())
  cache.set(tokenVersionId, { key, iv })

  return returnData
}

// 토큰, enc, integrity 얻기
async function getTEIData() {
  console.log('나이스 키 생성')
  let returnData = null
  // 토큰발급이 안된경우
  if (!cryptoToken.getTokenVersionId()) {
    returnData = await getEncryptOauthToken()
    console.log('토큰미발급 :', returnData)
  } else {
    const now = new Date()
    const validToken =
      cryptoToken.getIssDate() > now.getTime() - cryptoToken.getPeriod()
    // 토큰 유효기간이 유효한경우
    if (validToken) {
      returnData = {
        tokenVersionId: cryptoToken.getTokenVersionId(),
        encData: cryptoToken.getEncData(),
        integrityValue: cryptoToken.getIntegrityValue(),
      }
      console.log('유효한토큰 :', returnData)
      // 토큰 유효기간이 유효하지 않은경우
    } else {
      returnData = await getEncryptOauthToken()
      console.log('유효하지 않은 토큰 :', returnData)
    }
  }
  return returnData
}

// 인증결과 복호화
async function decryptURL(url) {
  const urlString = url
  const parsedUrl = new URL(urlString)
  const queryParameters = new URLSearchParams(parsedUrl.search)
  const queryObj = {}
  queryParameters.forEach((value, key) => {
    queryObj[key] = value
  })

  const tokenVersionId = queryObj.token_version_id
  const encData = queryObj.enc_data
  const { key, iv } = cache.get(tokenVersionId)

  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
  let resData = decipher.update(encData, 'base64', 'binary')
  resData += decipher.final('binary')
  resData = iconv.decode(Buffer.from(resData, 'binary'), 'euc-kr')

  return JSON.parse(resData)
}

module.exports = {
  getTEIData,
  decryptURL,
}

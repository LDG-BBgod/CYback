/*
모듈출력 :
sendMessageFunc(phone, content) 문자발송
*/
const crypto = require('crypto')
const axios = require('axios')

function getSigningKey() {
  const timestamp = Date.now().toString()
  const AccessKey = 'Lyf4UlLYnAqvptuxG9Oq' //변경예정
  const SecretKey = 'O8DxN19g9zaRZ335Wgx5FCzQfXPIbZfkLR5dng4C' //변경예정

  const method = 'POST'
  const uri = '/sms/v2/services/ncp:sms:kr:289661419957:gabot/messages' //변경예정

  const message = `${method} ${uri}\n${timestamp}\n${AccessKey}`
  const signingKey = crypto
    .createHmac('sha256', SecretKey)
    .update(message)
    .digest('base64')

  return signingKey
}

async function sendSENS(phone, content) {
  const timestamp = Date.now().toString()
  const signingKey = getSigningKey()

  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'x-ncp-apigw-timestamp': timestamp,
    'x-ncp-iam-access-key': 'Lyf4UlLYnAqvptuxG9Oq', //변경예정
    'x-ncp-apigw-signature-v2': signingKey,
  }

  const body = {
    type: 'SMS',
    contentType: 'COMM',
    countryCode: '82',
    from: '01054088229',
    content: `[chiyoom] 휴대폰 본인인증번호 [${content}]`,
    messages: [
      {
        to: phone,
      },
    ],
  }

  try {
    const response = await axios.post(
      'https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:289661419957:gabot/messages',
      body,
      { headers }
    )
  } catch (error) {
    console.error(error)
  }
}

// async function phoneVerify(phoneNumber) {
//   const verificationCode = Math.floor(100000 + Math.random() * 900000)

//   cache.set(phoneNumber, verificationCode)
//   await sendSENS(phoneNumber, verificationCode)
//   return true
// }

// async function phoneCheck(phoneNumber, verificationCode) {
//   const cachedCode = cache.get(phoneNumber)

//   if (cachedCode && cachedCode === Number(verificationCode)) {
//     // 인증번호가 일치하는 경우
//     return true
//   } else {
//     // 인증번호가 일치하지 않는 경우
//     return false
//   }
// }

module.exports = {
  sendSENS,
}

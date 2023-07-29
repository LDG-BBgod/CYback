const crypto = require('crypto')
const { User } = require('../mongoose/model')

const getToken = (data) => {
  const salt = String(Math.round(new Date().valueOf() * Math.random()))
  const token = crypto.createHmac('sha256', salt).update(data).digest('hex')
  return token
}

const checkToken = async (dbToken, appToken) => {
  if (dbToken === appToken) {
    return true
  } else {
    return false
  }
}

module.exports = {
  getToken,
  checkToken,
}

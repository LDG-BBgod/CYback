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

const createId = async () => {
  let isUniqueIdUnique = false
  let randomNumber = ''

  while (!isUniqueIdUnique) {
    randomNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString()
    const existingUser = await User.findOne({
      uniqueId: randomNumber,
    })
    if (!existingUser) {
      isUniqueIdUnique = true
    }
  }
  return randomNumber
}

module.exports = {
  getToken,
  checkToken,
  createId
}

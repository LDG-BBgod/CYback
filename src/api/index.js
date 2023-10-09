// DB
const User = require('./users')
const Hospital = require('./hospitals')

// API
const SENS = require('./sens')
const NICE = require('./nice')
const SENDEMAIL = require('./sendEmail')


module.exports = {
  User,
  Hospital,

  SENS,
  NICE,
  SENDEMAIL,
}

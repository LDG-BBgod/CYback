// DB
const User = require('./users')
const Hospital = require('./hospitals')
const Center = require('./center')

// API
const SENS = require('./sens')
const NICE = require('./nice')
const SENDEMAIL = require('./sendEmail')


module.exports = {
  User,
  Hospital,
  Center,

  SENS,
  NICE,
  SENDEMAIL,
}

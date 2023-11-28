// DB
const User = require('./users')
const Hospital = require('./hospitals')
const HospitalMember = require('./hospitalMember')
const Reserve = require('./reserve')

// API
const SENS = require('./sens')
const NICE = require('./nice')
const SENDEMAIL = require('./sendEmail')


module.exports = {
  User,
  Hospital,
  HospitalMember,
  Reserve,

  SENS,
  NICE,
  SENDEMAIL,
}

const mongoose = require('mongoose')
const crypto = require('crypto')

const Center = new mongoose.Schema({
  CenterName: { type: String, default: '', required: true },
  phone: { type: String, default: '', required: true },
  crn: { type: String, default: '', required: true },
  counselorName: { type: String, default: '', required: true },
  userId: { type: String, default: '', required: true },
  hashedPassword: { type: String, default: '', required: true },
  salt: { type: String, required: true },
  address: { type: String, default: '', required: true },
  introduction: { type: String, default: '', required: true },
  register: { type: Date, default: Date.now, required: true },
  token: { type: String, default: '', required: false },
})

Center.virtual('password').set(function (password) {
  this._password = password
  this.salt = this.makeSalt()
  this.hashedPassword = this.encryptPassword(password)
})

Center.method('makeSalt', () => {
  return Math.round(new Date().valueOf() * Math.random())
})

Center.method('encryptPassword', function (plainPassword) {
  return crypto
    .createHmac('sha256', this.salt)
    .update(plainPassword)
    .digest('hex')
})

Center.method('authenticate', function (plainPassword) {
  return this.encryptPassword(plainPassword) === this.hashedPassword
})

module.exports = Center

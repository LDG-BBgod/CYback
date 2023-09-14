const mongoose = require('mongoose')
const crypto = require('crypto')

const Hospital = new mongoose.Schema({
  hospitalName: { type: String, default: '', required: true },
  phone: { type: String, default: '', required: true },
  crn: { type: String, default: '', required: true },
  doctorName: { type: String, default: '', required: true },
  userId: { type: String, default: '', required: true },
  hashedPassword: { type: String, default: '', required: true },
  salt: { type: String, required: true },
  address: { type: String, default: '', required: true },
  introduction: { type: String, default: '', required: true },
  register: { type: Date, default: Date.now, required: true },
  token: { type: String, default: '', required: false },
})

Hospital.virtual('password').set(function (password) {
  this._password = password
  this.salt = this.makeSalt()
  this.hashedPassword = this.encryptPassword(password)
})

Hospital.method('makeSalt', () => {
  return Math.round(new Date().valueOf() * Math.random())
})

Hospital.method('encryptPassword', function (plainPassword) {
  return crypto
    .createHmac('sha256', this.salt)
    .update(plainPassword)
    .digest('hex')
})

Hospital.method('authenticate', function (plainPassword) {
  return this.encryptPassword(plainPassword) === this.hashedPassword
})

module.exports = Hospital
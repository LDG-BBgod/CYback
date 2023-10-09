const mongoose = require('mongoose')
const crypto = require('crypto')

const Center = new mongoose.Schema({
  userId: { type: String, default: '', required: true },
  hashedPassword: { type: String, default: '', required: true },
  salt: { type: String, required: true },
  hospitalName: { type: String, default: '', required: true },
  doctorName: { type: String, default: '', required: true },
  license: { type: String, default: '', required: true },
  address1: { type: String, default: '', required: true },
  address2: { type: String, default: '', required: true },
  address3: { type: String, default: '', required: false },
  bn: { type: String, default: '', required: true },
  email: { type: String, default: '', required: true },
  allowed: { type: String, default: false, required: true },
  register: { type: Date, default: Date.now, required: true },

  phone: { type: String, default: '', required: false },
  introduction: { type: String, default: '', required: false },
  imageUrls: { type: Array, default: '', required: false },
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

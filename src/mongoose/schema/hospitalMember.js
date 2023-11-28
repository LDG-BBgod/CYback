const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

const HospitalMember = new mongoose.Schema({
  // 회원가입시
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  userId: { type: String, default: '', required: true },
  hashedPassword: { type: String, default: '', required: true },
  salt: { type: String, required: true },
  name: { type: String, default: '', required: true },
  licenseType: { type: String, default: '', required: true },
  license: { type: String, default: '', required: true },
  email: { type: String, default: '', required: true },
  register: { type: Date, default: Date.now, required: true },

  // 회원가입후
  allowed: { type: String, default: 'false', required: true },

  // 토큰
  token: { type: String, default: '', required: false },
})

HospitalMember.virtual('password').set(function (password) {
  this._password = password
  this.salt = this.makeSalt()
  this.hashedPassword = this.encryptPassword(password)
})

HospitalMember.method('makeSalt', () => {
  return Math.round(new Date().valueOf() * Math.random())
})

HospitalMember.method('encryptPassword', function (plainPassword) {
  return crypto
    .createHmac('sha256', this.salt)
    .update(plainPassword)
    .digest('hex')
})

HospitalMember.method('authenticate', function (plainPassword) {
  return this.encryptPassword(plainPassword) === this.hashedPassword
})

module.exports = HospitalMember

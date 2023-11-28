const mongoose = require('mongoose')
const crypto = require('crypto')

const Hospital = new mongoose.Schema({
  // 회원가입시
  userId: { type: String, default: '', required: true },
  hashedPassword: { type: String, default: '', required: true },
  salt: { type: String, required: true },
  hospitalType: { type: String, default: '', required: true },
  hospitalName: { type: String, default: '', required: true },
  address1: { type: String, default: '', required: true },
  address2: { type: String, default: '', required: true },
  address3: { type: String, default: '', required: false },
  hospitalPhone: { type: String, default: '', required: false },
  bn: { type: String, default: '', required: true },
  doctorName: { type: String, default: '', required: true },
  licenseType: { type: String, default: '', required: true },
  license: { type: String, default: '', required: true },
  doctorPhone: { type: String, default: '', required: false },
  email: { type: String, default: '', required: true },
  register: { type: Date, default: Date.now, required: true },

  // 회원가입후
  allowed: { type: String, default: 'false', required: true },
  initSetting: { type: String, default: 'false', required: true },
  introduction: { type: String, default: '', required: false },
  imageUrls: { type: Array, default: '', required: false },

  // 예약관리
  timeSection: { type: String, default: '', required: false },
  daySH: { type: String, default: '', required: false },
  daySM: { type: String, default: '', required: false },
  dayEH: { type: String, default: '', required: false },
  dayEM: { type: String, default: '', required: false },
  skipWeek1: { type: String, default: '', required: false },
  week1SH: { type: String, default: '', required: false },
  week1SM: { type: String, default: '', required: false },
  week1EH: { type: String, default: '', required: false },
  week1EM: { type: String, default: '', required: false },
  skipWeek2: { type: String, default: '', required: false },
  week2SH: { type: String, default: '', required: false },
  week2SM: { type: String, default: '', required: false },
  week2EH: { type: String, default: '', required: false },
  week2EM: { type: String, default: '', required: false },
  skipLunch: { type: String, default: '', required: false },
  lunchSH: { type: String, default: '', required: false },
  lunchSM: { type: String, default: '', required: false },
  lunchEH: { type: String, default: '', required: false },
  lunchEM: { type: String, default: '', required: false },


  // 토큰
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

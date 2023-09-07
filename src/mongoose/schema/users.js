const mongoose = require('mongoose')
const crypto = require('crypto')

const User = new mongoose.Schema({
  name: { type: String, default: '', required: true, unique: true },
  nickName: { type: String, default: '', required: true, unique: true },
  hashedPassword: { type: String, default: '', required: true },
  salt: { type: String, required: true },
  phone: { type: String, default: '', required: true },
  fsm: { type: String, default: '', required: true, unique: true },
  bsm: { type: String, default: '', required: true, unique: true },
  email: { type: String, default: '', required: true },
  emailVerify: { type: String, default: 'false'},
  point: { type: Number, default: 0, required: true },
  profilePath: { type: String, default: '', required: false },
  token: { type: String, default: '', required: false },
  register: { type: Date, default: Date.now, required: true },
  nickNameRegister: { type: Date, default: Date.now, required: true },
  uniqueId: { type: String, default: '', required: true, unique: true },
})

User.virtual('password').set(function (password) {
  this._password = password
  this.salt = this.makeSalt()
  this.hashedPassword = this.encryptPassword(password)
})

User.method('makeSalt', () => {
  return Math.round(new Date().valueOf() * Math.random())
})

User.method('encryptPassword', function (plainPassword) {
  return crypto
    .createHmac('sha256', this.salt)
    .update(plainPassword)
    .digest('hex')
})

User.method('authenticate', function (plainPassword) {
  return this.encryptPassword(plainPassword) === this.hashedPassword
})

module.exports = User

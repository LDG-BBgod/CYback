const mongoose = require('mongoose')
const crypto = require('crypto')

const Reserve = new mongoose.Schema({
  name: { type: String, default: '', required: true },
})

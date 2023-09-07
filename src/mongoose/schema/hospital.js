const mongoose = require('mongoose')
const crypto = require('crypto')

const Hospital = new mongoose.Schema({
  name: { type: String, default: '', required: true },
})

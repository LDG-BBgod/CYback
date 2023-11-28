const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Reserve = new mongoose.Schema({
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  name: { type: String, default: '', required: true },
  birth: { type: String, default: '', required: true },
  phone: { type: String, default: '', required: true },
  date: { type: String, default: '', required: true },
  time: { type: String, default: '', required: true },
  register: { type: Date, default: Date.now, required: true },
})

module.exports = Reserve
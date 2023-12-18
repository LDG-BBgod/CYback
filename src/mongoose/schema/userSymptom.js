const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSymptom = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  symptomArr: [
    {
      name: { type: String, default: '', required: false },
      startTime: { type: String, default: '', required: false },
      duration: { type: String, default: '', required: false },
      intensity: { type: String, default: '', required: false },
    },
  ],
  drugArr: [
    {
      name: { type: String, default: '', required: false },
      volume: { type: String, default: '', required: false },
      amount: { type: String, default: '', required: false },
    },
  ],
  lifestyle: {
    smoke: { type: String, default: '', required: false },
    alcohol: { type: String, default: '', required: false },
    coffee: { type: String, default: '', required: false },
    health: { type: String, default: '', required: false },
    sleep: { type: String, default: '', required: false },
  },
  memo: {
    note: { type: String, default: '', required: false },
  },
  register: { type: Date, default: Date.now, required: true },
})

module.exports = UserSymptom

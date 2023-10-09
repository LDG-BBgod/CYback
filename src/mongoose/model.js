const mongoose = require('mongoose')
require('dotenv').config()
const schema = require('./schema')

const db = mongoose.connection
const model = (() => {
  db.on('error', console.error)
  db.on('open', () => {})

  mongoose.connect(
    `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PW}@cluster1.4wybg8h.mongodb.net/chiyoom`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )

  const models = {}
  for (const key in schema) {
    models[key] = mongoose.model(key, schema[key])
  }
  console.log('완료')
  return models
})()

module.exports = model

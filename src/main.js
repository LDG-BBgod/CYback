// @ts-check
/* eslint-disable no-console */
const express = require('express')
const cors = require('cors')

const userRouter = require('./routers/users')
const phoneVerifyRouter = require('./routers/phoneVerify')
const niceRouter = require('./routers/nice')

const app = express()
const PORT = 5000
const corsOptions = {
  origin: '*',
}
app.use(express.json())
app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.send('서버 접속 성공')
})

app.use('/user', userRouter)
app.use('/phone', phoneVerifyRouter)
app.use('/nice', niceRouter)

app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500
  res.send(err.message)
})
setInterval(() => {
  console.log(123123)
}, 1000)
app.listen(PORT, () => {
  console.log(`PORT = ${PORT}`)
})

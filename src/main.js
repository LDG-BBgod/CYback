// @ts-check
/* eslint-disable no-console */
const express = require('express')
const cors = require('cors')
const path = require('path')

const userRouter = require('./routers/users')
const webUserRouter = require('./routers/webUser')
const hospitalRouter = require('./routers/hospital')
const hospitalMemberRouter = require('./routers/hospitalMember')
const reserveRouter = require('./routers/reserve')
const userSymptomRouter = require('./routers/userSymptom')

const phoneVerifyRouter = require('./routers/phoneVerify')
const niceRouter = require('./routers/nice')
const emailVerifyRouter = require('./routers/emailVerify')
const weatherRouter = require('./routers/weather')

const app = express()
const PORT = 4000
const corsOptions = {
  origin: '*',
}
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.send('서버 접속 성공')
})

app.use('/user', userRouter)
app.use('/webUser', webUserRouter)
app.use('/hospital', hospitalRouter)
app.use('/hospitalMember', hospitalMemberRouter)
app.use('/reserve', reserveRouter)
app.use('/symptom', userSymptomRouter)

app.use('/phone', phoneVerifyRouter)
app.use('/nice', niceRouter)
app.use('/email', emailVerifyRouter)
app.use('/weather', weatherRouter)

app.use('/upload', express.static(path.join(__dirname, '../upload')))

app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500
  res.send(err.message)
})

app.listen(PORT, () => {
  console.log(`PORT = ${PORT}`)
})
app.listen(PORT, '0.0.0.0')

const { Hospital } = require('../mongoose/model')
const { checkToken, getToken } = require('./token')

const hospitalCreate = async (req, res) => {
  console.log('post hospital/create')
  const {
    hospitalName,
    phone,
    crn,
    doctorName,
    userId,
    password,
    address,
    introduction,
  } = req.body
  const token = getToken(userId)
  const isExist = await Hospital.findOne({ userId })
  if (!isExist) {
    const newHostpital = await Hospital({
      hospitalName,
      phone,
      crn,
      doctorName,
      userId,
      password,
      address,
      introduction,
      token,
    })
    try {
      await newHostpital.save()
      const resContent = {
        err: false,
        msg: {
          userId,
          token,
        },
      }
      res.send(resContent)
    } catch (err) {
      const resContent = {
        err: true,
        msg: {},
      }
      res.send(resContent)
    }
  } else {
    const resContent = {
      err: true,
      msg: {
        errMsg: '이미 존재하는 아이디입니다.',
      },
    }
    res.send(resContent)
  }
}

module.exports = {
  hospitalCreate,
}

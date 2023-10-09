const { Hospital, Center } = require('../mongoose/model')
const { checkToken, getToken } = require('./token')

const centerCreate = async (req, res) => {
  console.log('post center/create')

  const {
    id,
    pw,
    hospitalName,
    doctorName,
    license,
    address1,
    address2,
    address3,
    bn,
    email,
  } = req.body
  const token = getToken(id)
  const isExist1 = await Hospital.findOne({ userId: id })
  const isExist2 = await Center.findOne({userId: id})

  if (isExist1 || isExist2) {
    const resContent = {
      err: false,
      msg: {
        isExist: true,
      },
    }
    res.send(resContent)
  } else {
    const newCenter = await Center({
      userId: id,
      password: pw,
      hospitalName,
      doctorName,
      license,
      address1,
      address2,
      address3,
      bn,
      email,
      token,
    })
    try {
      await newCenter.save()
      const resContent = {
        err: false,
        msg: {
          isExist: false,
          id,
          token,
        },
      }
      res.send(resContent)
    } catch (err) {
      console.log(err)
      const resContent = {
        err: true,
        msg: {},
      }
      res.send(resContent)
    }
  }
}

module.exports = {
  centerCreate,
}

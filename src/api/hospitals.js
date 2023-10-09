const { Hospital, Center } = require('../mongoose/model')
const { checkToken, getToken } = require('./token')

const hospitalCreate = async (req, res) => {
  console.log('post hospital/create')

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
    const newHostpital = await Hospital({
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
    })
    try {
      await newHostpital.save()
      const resContent = {
        err: false,
        msg: {
          isExist: false,
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


// const hospitalUpdate = async (req, res) => {
//   const {
//     hospitalName,
//     phone,
//     crn,
//     doctorName,
//     userId,
//     password,
//     address,
//     introduction,
//   } = JSON.parse(req.body.jsonField)
//   const imageUrls = req.files.map((file) => file.path)

//   const token = getToken(userId)
//   const isExist = await Hospital.findOne({ userId })

//   const newHostpital = await Hospital({
//     hospitalName,
//     phone,
//     crn,
//     doctorName,
//     userId,
//     password,
//     address,
//     introduction,
//     imageUrls,
//     token,
//   })
//   try {
//     await newHostpital.save()
//     const resContent = {
//       err: false,
//       msg: {
//         userId,
//         token,
//       },
//     }
//     res.send(resContent)
//   } catch (err) {
//     const resContent = {
//       err: true,
//       msg: {},
//     }
//     res.send(resContent)
//   }
// }

module.exports = {
  hospitalCreate,
  // hospitalUpdate,
}

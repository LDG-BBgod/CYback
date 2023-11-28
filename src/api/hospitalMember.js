const { Hospital, HospitalMember } = require('../mongoose/model')

const hospitalMemberCreate = async (req, res) => {
  console.log('post hospitalMember/create')

  const { OID, email, id, pw, name, licenseType, license } = req.body
  console.log(OID)

  const isExistHospital = await Hospital.findOne({ userId: id })
  const isExistMember = await HospitalMember.findOne({ userId: id })

  if (isExistHospital || isExistMember) {
    const resContent = {
      err: false,
      msg: {
        isExist: true,
      },
    }
    res.send(resContent)
  } else {
    const newHostpitalMember = await HospitalMember({
      hospital: OID,
      userId: id,
      password: pw,
      name,
      licenseType,
      license,
      email,
    })
    try {
      await newHostpitalMember.save()
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

module.exports = {
  hospitalMemberCreate,
}

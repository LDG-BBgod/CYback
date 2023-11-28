const { Reserve } = require('../mongoose/model')

const reserveCreate = async (req, res) => {
  console.log('post reserve/create')

  const { OID, Y, M, D, time, name, birth, phone } = req.body
  const resContent = {
    err: false,
    msg: {},
  }

  const newReserve = await Reserve({
    hospital: OID,
    name,
    birth,
    phone,
    date: `${Y}-${M}-${D}`,
    time,
  })
  try {
    await newReserve.save()
    resContent.msg = {
      success: true,
    }
  } catch (err) {
    resContent.err = true
  }

  res.send(resContent)
}

const reserveRead = async (req, res) => {
  console.log('post reserve/read')

  const { OID, Y, M, D } = req.body
  const resContent = {
    err: false,
    msg: {},
  }
  const reserveArr = []

  try {
    await Reserve.find({ hospital: OID, date: `${Y}-${M}-${D}` }).then(
      (data) => {
        data.forEach((element) => {
          const { time, name, birth, phone } = element
          reserveArr.push({ time, name, birth, phone })
        })
      }
    )
    resContent.msg.data = reserveArr
  } catch (err) {
    resContent.err = true
    console.error(err)
  }

  res.send(resContent)
}

const reserveReadOne = async (req, res) => {
  console.log('post reserve/readOne')

  const { OID, Y, M, D, time } = req.body
  const resContent = {
    err: false,
    msg: {},
  }

  try {
    await Reserve.find({ hospital: OID, date: `${Y}-${M}-${D}`, time: time }).then(
      (data) => {
        console.log(data)
      }
    )
  } catch (err) {
    resContent.err = true
    console.error(err)
  }

  res.send(resContent)
}

module.exports = {
  reserveCreate,
  reserveRead,
  reserveReadOne,
}

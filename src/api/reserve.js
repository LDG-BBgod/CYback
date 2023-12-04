const { Reserve } = require('../mongoose/model')
const dayjs = require('dayjs')

const changeKoreaDate = (Y, M, D) => {
  const currentDate = new Date(`${Y}-${M}-${D}`)
  const koreaOffset = 9 * 60 * 60000
  const koreaDate = new Date(currentDate.getTime() + koreaOffset)
  return koreaDate
}

const reserveCreate = async (req, res) => {
  console.log('post reserve/create')

  const { OID, Y, M, D, time, name, birth, phone } = req.body
  const resContent = {
    err: false,
    msg: {},
  }

  try {
    const date = changeKoreaDate(Y, M, D)
    const newReserve = await Reserve({
      hospital: OID,
      name,
      birth,
      phone,
      date,
      time,
    })
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
  try {
    const startDate = changeKoreaDate(Y, M, D)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 7)

    const dataForWeek = await Reserve.find({
      hospital: OID,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
    resContent.msg.reserve = dataForWeek
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
  const koreaDate = changeKoreaDate(Y, M, D)
  try {
    await Reserve.findOne({
      hospital: OID,
      date: koreaDate,
      time: time,
    }).then((data) => {
      resContent.msg = {
        name: data.name,
        birth: data.birth,
        phone: data.phone,
      }
    })
  } catch (err) {
    resContent.err = true
    console.error(err)
  }

  res.send(resContent)
}

const reserveDelete = async (req, res) => {
  console.log('post reserve/delete')
  const { OID, Y, M, D, time } = req.body
  const resContent = {
    err: false,
    msg: {},
  }
  try {
    const koreaDate = changeKoreaDate(Y, M, D)
    await Reserve.deleteOne({
      hospital: OID,
      date: koreaDate,
      time
    }).then(() => {
      resContent.msg = {
        success: true,
      }
    })
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
  reserveDelete,
}

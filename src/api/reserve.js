const { Reserve } = require('../mongoose/model')
const dayjs = require('dayjs')

const changeKoreaDate = (Y, M, D) => {
  const currentDate = new Date(`${Y}-${M}-${D}`)
  const koreaOffset = 9 * 60 * 60000
  const koreaDate = new Date(currentDate.getTime() + koreaOffset)
  return koreaDate
}

// Web //
const reserveCreate = async (req, res) => {
  console.log('post reserve/create')

  const { OID, Y, M, D, time, name, birth, phone } = req.body
  const resContent = {
    err: false,
    msg: {},
  }

  try {
    const koreaDate = changeKoreaDate(Y, M, D)
    const reserve = await Reserve.findOne({
      hospital: OID,
      date: koreaDate,
      time: time,
    })
    if (!reserve) {
      const newReserve = await Reserve({
        hospital: OID,
        name,
        birth,
        phone,
        date: koreaDate,
        time,
        state: '확인',
      })
      await newReserve.save()
      resContent.msg = {
        success: true,
      }
    } else {
      resContent.msg = {
        success: false,
        text: '이미 예약된 시간입니다.',
      }
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
      time,
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

const reserveSubmit = async (req, res) => {
  console.log('post reserve/submit')
  const { OID, Y, M, D, time } = req.body
  const resContent = {
    err: false,
    msg: {},
  }
  try {
    const koreaDate = changeKoreaDate(Y, M, D)
    const reserve = await Reserve.findOne({
      hospital: OID,
      date: koreaDate,
      time,
    })
    reserve.state = '확인'
    await reserve.save()
    resContent.msg.success = true
  } catch (err) {
    resContent.err = true
    console.error(err)
  }
  res.send(resContent)
}

// App //
const reserveReadDay = async (req, res) => {
  console.log('post reserve/readDay')

  const { OID, Y, M, D } = req.body
  const resContent = {
    err: false,
    msg: {},
  }
  const koreaDate = changeKoreaDate(Y, M, D)
  try {
    const resArr = []
    await Reserve.find({
      hospital: OID,
      date: koreaDate,
    }).then((data) => {
      data.forEach((element) => {
        resArr.push(element.time)
      })
      resContent.msg = {
        reserveArr: resArr,
      }
    })
  } catch (err) {
    resContent.err = true
    console.error(err)
  }
  res.send(resContent)
}

const reserveAppCreate = async (req, res) => {
  console.log('post reserve/appCreate')

  const { OID, Y, M, D, time, name, birth, phone } = req.body
  const resContent = {
    err: false,
    msg: {},
  }

  try {
    const koreaDate = changeKoreaDate(Y, M, D)
    const reserve = await Reserve.findOne({
      hospital: OID,
      date: koreaDate,
      time: time,
    })
    if (!reserve) {
      const newReserve = await Reserve({
        hospital: OID,
        name,
        birth,
        phone,
        date: koreaDate,
        time,
        state: '대기',
      })
      await newReserve.save()
      resContent.msg = {
        success: true,
      }
    } else {
      resContent.msg = {
        success: false,
        text: '이미 예약된 시간입니다.',
      }
    }
  } catch (err) {
    resContent.err = true
  }

  res.send(resContent)
}

module.exports = {
  // Web
  reserveCreate,
  reserveRead,
  reserveReadOne,
  reserveDelete,
  reserveSubmit,
  // App
  reserveReadDay,
  reserveAppCreate,
}

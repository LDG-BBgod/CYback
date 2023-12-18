const { User, UserSymptom } = require('../mongoose/model')

const changeKoreaDate = (Y, M, D) => {
  const currentDate = new Date(`${Y}-${M}-${D}`)
  const koreaOffset = 9 * 60 * 60000
  const koreaDate = new Date(currentDate.getTime() + koreaOffset)
  return koreaDate
}

const userSymptomCreate = async (req, res) => {
  console.log('post symptom/create')

  const resContent = {
    err: false,
    msg: {},
  }

  try {
    const { token, symptom, Y, M, D } = req.body
    const date = new Date(`${Y}-${M}-${D}`)
    const user = await User.findOne({ token })
    const userSymptom = await UserSymptom.findOne({ user: user._id, date: date })

    if (!userSymptom) {
      const newUserSymptom = await UserSymptom({
        user: user._id,
        date: date,
        symptomArr: symptom.symptomArr,
        drugArr: symptom.drugArr,
        lifestyle: symptom.lifestyle,
        memo: { note: symptom.memo },
      })
      await newUserSymptom.save()
      resContent.msg.success = true
    } else {
      resContent.msg.success = false
    }
  } catch (e) {
    console.error(e)
    resContent.err = true
  }

  res.send(resContent)
}

module.exports = {
  userSymptomCreate,
}

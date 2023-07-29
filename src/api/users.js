/*
모듈출력 :
userCreate  회원가입
userRead    미정
userUpdate  미정
userDelete  회원삭제
userLogin   로그인
userLogout  로그아웃
*/
const { User } = require('../mongoose/model')
const { checkToken, getToken } = require('./token')

const userCreate = async (req, res) => {
  const { name, nickName, password, phone, fsm, bsm, email } = req.body
  const token = getToken(phone)
  const newUser = await User({
    name,
    nickName,
    password,
    phone,
    fsm,
    bsm,
    email,
    token,
  })
  try {
    const saveRequest = await newUser.save()
    const resContent = {
      err: false,
      msg: {
        phone,
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
}

const userRead = async (req, res) => {
  const phone = req.body.phone
  const token = req.body.token
  const user = await User.findOne({ phone: phone })
  const isToken = checkToken(user.token, token)

  if (isToken) {
    const resContent = {
      err: false,
      msg: {
        errCode: false,
        name: user.name,
        nickName: user.nickName,
        hashedPassword: user.hashedPassword,
        phone: user.phone,
        fsm: user.fsm,
        bsm: user.bsm,
        email: user.email,
        point: user.point,
        profilePath: user.profilePath,
      },
    }
    return res.send(resContent)
  } else {
    const resContent = {
      err: false,
      msg: {
        errCode: true,
      },
    }
    return res.send(resContent)
  }
}

const userUpdate = async (req, res) => {
  const phone = req.body.phone
  const token = req.body.token
  const user = await User.findOne({ phone: phone })
  const isToken = checkToken(user.token, token)
  const resContent = {
    err: false,
    msg: {},
  }
  if (!isToken) {
    return res.send(resContent)
  }

  switch (req.body.change) {
    case 'profilePath':
      user.profilePath = req.body.profilePath
      user.save()
      return res.send(resContent)
    default:
      break
  }
}

const userDelete = async (req, res) => {
  // 작성필요
}

const userLogin = async (req, res) => {
  const phone = req.body.phone
  const user = await User.findOne({ phone: phone })

  if (user) {
    const resContent = {
      err: false,
      msg: {
        isExist: true,
      },
    }
    return res.send(resContent)
  } else {
    const resContent = {
      err: false,
      msg: {
        isExist: false,
      },
    }
    return res.send(resContent)
  }
}

const userLogout = async (req, res) => {
  // 작성필요
}

module.exports = {
  userCreate,
  userRead,
  userUpdate,
  userDelete,
  userLogin,
  userLogout,
}

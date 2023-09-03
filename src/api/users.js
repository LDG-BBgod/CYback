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
const { checkToken, getToken, createId } = require('./token')

const userCreate = async (req, res) => {
  console.log('post user/create')
  const { name, nickName, password, phone, fsm, bsm, email } = req.body
  const token = getToken(phone)
  const uniqueId = await createId()

  const newUser = await User({
    name,
    nickName,
    password,
    phone,
    fsm,
    bsm,
    email,
    token,
    uniqueId,
  })
  try {
    await newUser.save()
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
  console.log('post user/read')
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
        phone: user.phone,
        fsm: user.fsm,
        bsm: user.bsm,
        email: user.email,
        emailVerify: user.emailVerify,
        point: user.point,
        profilePath: user.profilePath,
        nickNameRegister: user.nickNameRegister,
        uniqueId: user.uniqueId,
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
  console.log('post user/update')
  const phone = req.body.phone
  const token = req.body.token
  const user = await User.findOne({ phone: phone })
  const isToken = checkToken(user.token, token)
  let resContent = {
    err: false,
    msg: {},
  }
  if (!isToken) {
    resContent.err = true
    return res.send(resContent)
  }

  switch (req.body.target) {
    case 'profilePath':
      user.profilePath = req.body.profilePath
      await user.save()
      break
    case 'nickNameRegisterCehck':
      const registerDate = user.nickNameRegister
      const parsingDate = new Date(registerDate)
      const timeDifferenceSecond = Math.floor((new Date() - parsingDate) / 1000)
      // resContent.msg = {
      //   isAble: timeDifferenceSecond >= 60 * 60 * 24 * 30 ? true : false,
      // }
      resContent.msg = {
        isAble: timeDifferenceSecond >= 10 ? true : false,
      }
      break
    case 'nickName':
      user.nickName = req.body.nickName
      user.nickNameRegister = new Date()
      await user.save()
      break
    case 'pwCheck':
      const isTrue = user.authenticate(req.body.pw)
      resContent.msg = {
        isTrue,
      }
      break
    case 'pwChange':
      user.password = req.body.pw
      await user.save()
      break
    default:
      break
  }
  return res.send(resContent)
}

const userDelete = async (req, res) => {
  // 작성필요
}

const userLogin = async (req, res) => {
  console.log('post user/login')
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

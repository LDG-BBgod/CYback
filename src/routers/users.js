// @ts-check
const express = require('express')
const { User } = require('../api')

const router = express.Router()

// 필요없는부분
router.get('/', async (req, res) => {
  console.log('리퀘옴')
  res.send('응답완료')
})

router.post('/create', User.userCreate)
router.post('/read', User.userRead)
router.post('/update', User.userUpdate)
router.delete('/delete', User.userDelete)
router.post('/login', User.userLogin)
router.post('/logout', User.userLogout)

module.exports = router

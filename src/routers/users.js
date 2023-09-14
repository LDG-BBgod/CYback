// @ts-check
const express = require('express')
const { User } = require('../api')

const router = express.Router()

router.post('/create', User.userCreate)
router.post('/read', User.userRead)
router.post('/update', User.userUpdate)
router.delete('/delete', User.userDelete)
router.post('/login', User.userLogin)
router.post('/logout', User.userLogout)

module.exports = router

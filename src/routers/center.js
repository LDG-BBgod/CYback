const express = require('express')


const { Center } = require('../api')

const router = express.Router()


router.post('/create', Center.centerCreate)
router.post('/read', Center.centerRead)



module.exports = router

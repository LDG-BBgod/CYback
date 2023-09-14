const express = require('express')
const { Hospital } = require('../api')

const router = express.Router()

router.post('/create', Hospital.hospitalCreate)

module.exports = router
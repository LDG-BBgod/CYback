// @ts-check
const express = require('express')
const { UserSymptom } = require('../api')

const router = express.Router()

router.post('/create', UserSymptom.userSymptomCreate)

module.exports = router

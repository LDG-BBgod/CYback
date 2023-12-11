// @ts-check
const express = require('express')
const { Reserve } = require('../api')

const router = express.Router()

// Web
router.post('/create', Reserve.reserveCreate)
router.post('/read', Reserve.reserveRead)
router.post('/readOne', Reserve.reserveReadOne)
router.post('/delete', Reserve.reserveDelete)
router.post('/submit', Reserve.reserveSubmit)

// App
router.post('/readDay', Reserve.reserveReadDay)
router.post('/appCreate', Reserve.reserveAppCreate)

module.exports = router

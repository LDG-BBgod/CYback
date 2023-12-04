// @ts-check
const express = require('express')
const { Reserve } = require('../api')

const router = express.Router()

router.post('/create', Reserve.reserveCreate)
router.post('/read', Reserve.reserveRead)
router.post('/readOne', Reserve.reserveReadOne)
router.post('/delete', Reserve.reserveDelete)

module.exports = router

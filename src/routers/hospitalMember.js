const express = require('express')
const { HospitalMember } = require('../api')

const router = express.Router()

router.post('/create', HospitalMember.hospitalMemberCreate)

module.exports = router

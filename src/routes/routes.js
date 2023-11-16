const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

router.post('/usuarios', userController.newUser)

module.exports = router
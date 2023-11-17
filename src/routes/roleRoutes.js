const express = require('express')
const roleController = require('../controllers/roleController')
const router = express.Router()

router.get('/cargos', roleController.listRoles)

module.exports = router
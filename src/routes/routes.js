const express = require('express')
const router = express.Router()
const userRouter = require('./userRoutes')
const roleRouter = require('./roleRoutes')

router.use(userRouter)
router.use(roleRouter)

module.exports = router
const express = require('express')
const router = express.Router()

//user controller import
const { registerUser, login } = require('../controller/userController')

//register user
router.post("/register", registerUser)

//login user
router.post("/login", login)

module.exports = router
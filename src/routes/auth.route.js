const express = require('express')
const authController = require("../controllers/auth/auth.controller")
const userController = require("../controllers/user/user.controller")
const authMiddleware = require("../middleware/auth.middleware")
const authRouter = new express.Router()
const schema = require("../validations")
const validatorMiddleware = require("../middleware/validator.middleware")

authRouter.post('/auth/login', validatorMiddleware(schema.login, 'body'), authController.login)
authRouter.post('/auth/logout', authMiddleware, authController.logout)
authRouter.post('/auth/logoutAll', authMiddleware, authController.logoutAll)
authRouter.post('/auth/register', validatorMiddleware(schema.register, 'body'), userController.createUser)

module.exports = authRouter
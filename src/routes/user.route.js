const express = require('express')
const userController = require("../controllers/user/user.controller")
const userRouter = new express.Router()
const authMiddleware = require("../middleware/auth.middleware")
const schema = require("../validations")
const validatorMiddleware = require("../middleware/validator.middleware")
const upload = require("../middleware/multer.middleware")

userRouter.post('/', [authMiddleware, validatorMiddleware(schema.register, 'body')],  userController.createUser)
userRouter.get('/me', authMiddleware, userController.getCurrentUser)
userRouter.delete('/me', authMiddleware, userController.deleteUser)
userRouter.patch('/me', authMiddleware, userController.updateUser)
userRouter.put('/me/avatar', [authMiddleware, upload.single('avatar')], userController.uploadAvatar, (error, req, res, next) => {
  res.status(400).send({
    error: error.message,
    success: false
  })
})
userRouter.delete('/me/avatar', authMiddleware, userController.deleteAvatar)
userRouter.get('/:id/avatar', userController.getAvatar)
userRouter.get('/:id', [authMiddleware, validatorMiddleware(schema.getUser, 'params')], userController.getUser)


module.exports = userRouter 
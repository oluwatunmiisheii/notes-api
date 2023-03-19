const express = require('express')
const taskController = require("../controllers/task/task.controller")
const taskRouter = new express.Router();
const authMiddleware = require("../middleware/auth.middleware")
const schema = require("../validations")
const validatorMiddleware = require("../middleware/validator.middleware")

taskRouter.get('/tasks', authMiddleware, taskController.getTasks)
taskRouter.get('/tasks/:id', authMiddleware, taskController.getTask)
taskRouter.post('/tasks', [authMiddleware, validatorMiddleware(schema.createTask, 'body')], taskController.createTask)
taskRouter.patch('/tasks/:id', authMiddleware, taskController.updateTask)
taskRouter.delete('/tasks/:id', authMiddleware, taskController.deleteTask)


module.exports = taskRouter
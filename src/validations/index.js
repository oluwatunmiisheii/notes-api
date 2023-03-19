const authSchema = require("./auth.validation")
const userSchema = require("./user.validation")
const taskSchema = require("./task.validation")

module.exports = {
  login: authSchema.loginSchema,
  register: authSchema.registerSchema,
  getUser: userSchema.getUserSchema,
  createTask: taskSchema.createTaskSchema,
};
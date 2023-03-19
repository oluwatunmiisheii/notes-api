const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require("../../src/models/user.model")
const Task = require("../../src/models/task.model")
const { userOne, userTwo } = require("./users.fixtures")
const { taskOne, taskTwo, taskThree } = require("./tasks.fixtures")


const setupDatabase = async () => {
  await User.deleteMany()
  await new User(userOne).save()
  await new User(userTwo).save()

  await Task.deleteMany()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
}

const closeDbConnection = async () => {
  await mongoose.connection.close()
}

module.exports = {
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
  closeDbConnection,
}
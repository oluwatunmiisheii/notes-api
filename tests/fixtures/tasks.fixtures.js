const mongoose = require('mongoose')
const { userOneId, userTwoId } = require("./users.fixtures")

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First task",
  completed: false,
  owner: userOneId
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second task",
  completed: true,
  owner: userOneId
}

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Third task",
  completed: true,
  owner: userTwoId
}

module.exports = {
  taskOne,
  taskTwo,
  taskThree
}
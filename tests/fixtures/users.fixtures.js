const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: "Wilson",
  email: "wilson@gmail.com",
  password: "wilson12345",
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoId,
  name: "Tunmise",
  email: "tunmise@gmail.com",
  password: "tunmise12345",
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
  }]
}


module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo
}
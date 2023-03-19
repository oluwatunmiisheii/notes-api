const User = require("../../models/user.model")
const sharp = require('sharp')
const { sendWelcomeEmail } = require("../../emails/account.email")

class Users {
  async createUser (req, res) {
    const user = new User(req.body)
    try {
      await user.save()
      sendWelcomeEmail(user.email, user.name)
      const token = await user.generateAuthToken()
      res.status(201).send({
        data: {
          user,
          token
        },
        message: 'User created successfully',
        success: true
      })
    } catch (error) {
      res.status(400).send({
        message: 'User not created',
        success: false,
        error
      })
    }
  }

  async getUsers (req, res) {
    try {
      const users = await User.find({})
      res.status(200).send({
        data: users,
        message: 'Users fetched successfully',
        success: true
      })
    }catch (error) {
      res.status(500).send({
        message: 'Users not fetched',
        success: false,
        error
      })
    }
  }

  async getCurrentUser (req, res) {
    res.status(200).send({
      data: req.user,
      message: 'User fetched successfully',
      success: true
   })
  }

  async getUser (req, res) {
    const _id = req.params.id
    try {
      const user = await User.findById(_id)
      if(!user) {
        return res.status(404).send({
          message: 'user not found',
          success: false
        })
      }
      res.status(200).send({
        data: user,
        message: 'User fetched successfully',
        success: true
      })
    }catch(error) {
      res.status(500).send({
        message: 'User not fetched',
        success: false,
        error
      })
    }
  }

  async updateUser (req, res) {
    const _id = req.user._id

    const updates = Object.keys(req.body)
    const allowedUpdateArray = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdateArray.includes(update))
    
    if(!isValidOperation) {
      return res.status(400).send({error: 'Invalid updates!' })
    }
    
    try {
      const user = await User.findById(_id)
      if(!user) {
        return res.status(404).send({
          message: 'user not found',
          success: false
        })
      }

      updates.forEach((update) =>  user[update] = req.body[update])
      await user.save()

      res.status(200).send(user)
    }catch(error) {
      res.status(400).send(error)
    }
  }

  async deleteUser (req, res) {
    try {
      await req.user.remove();
      res.status(200).send({
        message: 'User deleted successfully',
        success: true
      })
    }catch(error) {
      res.status(500).send({
        message: 'User not deleted',
        success: false,
        error
      })
    }
  }

  async adminDeleteUser (req, res) {
    const _id = req.params.id
    try {
      const user = await User.findByIdAndDelete(_id)
      if(!user) {
        return res.status(404).send({
          message: 'user not found',
          status_code: 404,
          success: false
        })
      }
      res.status(200).send(user)
    }catch(error) {
      res.status(500).send(error)
    }
  }

  async adminUpdateUser (req, res) {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdateArray = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdateArray.includes(update))
    if(!isValidOperation) {
      return res.status(400).send({error: 'Invalid updates!' })
    }
    try {
      const user = await User.findById(_id)

      if(!user) {
        return res.status(404).send({
          message: 'user not found',
          status_code: 404,
          success: false
        })
      }

      updates.forEach((update) =>  user[update] = req.body[update])

      await user.save()

      res.status(200).send(user)
    }catch(error) {
      res.status(400).send(error)
    }
  }

  async uploadAvatar (req, res) {
    const file = req.file
    const buffer = await sharp(file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    const _id = req.user._id
    try {
      const user = await User.findOneAndUpdate({ _id }, { avatar: buffer }, { new: true })
      res.status(200).send({
        message: 'Image uploaded successfully',
        success: true,
        data: user
      })
    } catch(error) {
      res.status(500).send({
        message: 'Image not uploaded',
        success: false,
      })
    }
  }

  async deleteAvatar (req, res) {
    const _id = req.user._id
    try {
      const user = await User.findOneAndUpdate({ _id }, { avatar: undefined }, { new: true })
      res.status(200).send({
        message: 'User avatar deleted successfully',
        data: user,
        success: true
      })
    }catch(error) {
      res.status(500).send({
        message: 'Internal server error',
        success: false,
      })
    }
  }

  async getAvatar(req, res) {
    const _id = req.params.id
    try {
      const user = await User.findById(_id)

      if(!user || !user.avatar) {
        throw new Error()
      }

      res.set('Content-Type', 'image/png')
      res.send(user.avatar)

    }catch(error) {
      res.status(404).send({
        message: 'Image not found',
        success: false,
      })
    }
  }
}

module.exports = new Users()
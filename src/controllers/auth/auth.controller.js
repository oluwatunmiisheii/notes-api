const User = require("../../models/user.model")

class Auth {
  async login (req, res) {
    const { email, password } = req.body
    try {
      const user = await User.findByCredentials(email, password)
      if(!user) {
        throw new Error()
      }
      const token = await user.generateAuthToken()
      res.status(200).send({
        data: {
          user,
          token
        },
        message: 'User logged in successfully',
      })
    } catch (error) {
      res.status(400).send({
        message: 'Unable to login',
        success: false,
      })
    }
  }
  async logout (req, res) {
    try {
     req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
     await req.user.save();
      res.status(200).send({
        success: true,
        message: 'User logged out successfully'
     })
    } catch (error) {
      req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
      await req.user.save();
      res.status(500).send({
        success: false,
        message: 'Unable to logout'
      })
    }
  }
  async logoutAll (req, res) {
    try {
      req.user.tokens = []
      await req.user.save();

      res.status(200).send({
        success: true
      })
    } catch (error) {
      req.user.tokens = []
      await req.user.save();
      res.status(500).send({
        success: false,
        message: 'Unable to logout'
      })
    }
  }
}

module.exports = new Auth()
const authSchema = require("./auth.validation")
const userSchema = require("./user.validation")
const noteSchema = require("./note.validation")

module.exports = {
  login: authSchema.loginSchema,
  register: authSchema.registerSchema,
  getUser: userSchema.getUserSchema,
  createNote: noteSchema.createNoteSchema,
};
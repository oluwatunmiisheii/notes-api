const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: false,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, { timestamps: true })

const Note = mongoose.model('Note', noteSchema)

module.exports = Note
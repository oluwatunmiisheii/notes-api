const express = require('express')
const noteController = require("../controllers/task/note.controller")
const noteRouter = new express.Router();
const authMiddleware = require("../middleware/auth.middleware")
const schema = require("../validations")
const validatorMiddleware = require("../middleware/validator.middleware")

noteRouter.get('/', authMiddleware, noteController.getNotes)
noteRouter.get('/:id', authMiddleware, noteController.getNote)
noteRouter.post('/', [authMiddleware, validatorMiddleware(schema.createNote, 'body')], noteController.createNote)
noteRouter.patch('/:id', authMiddleware, noteController.updateNote)
noteRouter.delete('/:id', authMiddleware, noteController.deleteNote)


module.exports = noteRouter
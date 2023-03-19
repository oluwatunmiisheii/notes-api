const Joi = require('joi');


const noteSchemas = {
  createNoteSchema: Joi.object().keys({
    description: Joi.string().min(5).required(),
    title: Joi.string().required(),
    note: Joi.string().required(),
  })
}


module.exports = noteSchemas;
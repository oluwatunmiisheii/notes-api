const Joi = require('joi');


const taskSchemas = {
  createTaskSchema: Joi.object().keys({
    description: Joi.string().min(5).required(),
    completed: Joi.boolean().optional(),
  })
}


module.exports = taskSchemas;
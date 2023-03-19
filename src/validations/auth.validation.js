const Joi = require('joi');


const authSchemas = {
  loginSchema: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  registerSchema: Joi.object().keys({
    name: Joi.string().required(),
    age: Joi.number().optional().min(0),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })

}


module.exports = authSchemas;
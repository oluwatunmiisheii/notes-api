const Joi = require('joi');

const userSchemas = {
  getUserSchema: Joi.object().keys({
    id: Joi.string().required()
  })
}

module.exports = userSchemas;
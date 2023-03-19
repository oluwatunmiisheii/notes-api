const validatorMiddleware = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const { details } = error;

      const message = details.map((i) => ({ message: i.message }));

      return res.status(422).json({
        error: message,
        success: false,
      });
    }

    next();
  };
};
module.exports = validatorMiddleware;

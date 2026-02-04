const validateSchema = async (Schema, property = 'body') => {
  return (req, res, next) => {
    const data = req[property];

    const { error, value } = Schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(401).json({
        status: 'Failed',
        message: 'Validation failed',
        errors: error.details.map((err) => err.message),
      });
    }

    req[property] = value;
    next();
  };
};

export default validateSchema;

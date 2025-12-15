function validate(schema) {
  return function (req, res, next) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        msg: "Validation failed",
        errors: result.error.issues
      });
    }

    req.body = result.data;
    next();
  };
}

module.exports = validate;



// // Middleware that is used to wrap express handlers so we can avoid excessive try/catch usage.
module.exports = (func) => (req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);

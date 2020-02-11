// module.exports = fn => {
//   return (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
// };

const wrapHandler = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = {
  wrapHandler: wrapHandler,
  asyncHandler: asyncHandler
}

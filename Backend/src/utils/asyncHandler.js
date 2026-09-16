// Wraps an async route handler so any thrown error / rejected promise
// is passed to Express's error middleware instead of crashing the app.
//
//   router.post("/", asyncHandler(myController))
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = asyncHandler

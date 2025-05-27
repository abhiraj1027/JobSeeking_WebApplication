/**
 * Middleware to catch errors in asynchronous functions and forward them to the error handler.
 * @param {Function} theFunction - The asynchronous function that you want to wrap.
 * @returns {Function} The wrapped function that will handle errors.
 */
export const catchAsyncError = (theFunction) => {
    return (req, res, next) => {
      // Wrap the function call inside a Promise and catch any unhandled errors
      Promise.resolve(theFunction(req, res, next))
        .catch(next);  // Forward errors to the error middleware
    };
  };
  
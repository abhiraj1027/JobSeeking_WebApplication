export const checkRole = (role) => {
    return (req, res, next) => {
      const userRole = req.user.role;  // assuming user role is attached to the request object
      
      if (userRole !== role) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
        });
      }
      next();
    };
  };
  
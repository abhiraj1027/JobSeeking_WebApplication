export const generateToken = (user, message, statusCode, res) =>{
    const token = user.generateJsonWebToken();
    console.log(process.env.COOKIE_EXPIRE)
    console.log('i am on log in page')
  }
  
  export const sendToken = (user, statusCode, res, message) => {
      const token = user.getJWTToken();
      console.log(process.env.COOKIE_EXPIRE)
      const options = {
          expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
          ),
          httpOnly: true, // Set http Only to true
        };
        res.status(statusCode).cookie("token", token, options).json({
          success: true,
          user,
          message,
          token,
        });
  };
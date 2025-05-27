import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define the regex pattern for the password
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

function checkPasswordStrength(password) {
  // Define the regex pattern for the password
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

  // Check if the password matches the regex pattern
  if (passwordRegex.test(password)) {
    return 'Password is strong.';
  } else {
    return 'Password is too weak. Password must be at least 8 characters long, include at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.';
  }
}


// Define the regex pattern for the email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Define the regex pattern for the phone number (10 digits)
const phoneRegex = /^\d{10}$/;

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please enter your Name!"],
      minLength: [3, "Name must contain at least 3 Characters!"],
      maxLength: [30, "Name cannot exceed 30 Characters!"],
    },
    email: {
      type: String,
      required: [true, "Please enter your Email!"],
      validate: [validator.isEmail, "Please provide a valid Email!"],
      unique: true,
    trim: true,
    validate: {
      validator: function (value) {
        return emailRegex.test(value);
      },
      message: (props) => `${props.value} is not a valid email address.`
    }
    },
    phone: {
      type: Number,
      required: [true, "Please enter your Phone Number!"],
      unique: true,
    trim: true,
    validate: {
      validator: function (value) {
        return phoneRegex.test(value);
      },
      message: (props) => `${props.value} is not a valid phone number. Phone number must be exactly 10 digits.`
    }
    },
    password: {
      type: String,
      required: [true, "Please provide a Password!"],
      // minLength: [8, "Password must contain at least 8 characters!"],
      // maxLength: [32, "Password cannot exceed 32 characters!"],
      select: false,
      validate: {
        validator: function (value) {
          return passwordRegex.test(value);
        },
        message: (props) => `${props.value} is not a valid password. Password must be at least 8 characters long, include at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.`
      }
    },
    role: {
      type: String,
      required: [true, "Please select a role"],
      enum: ["Job Seeker", "Employer"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  //ENCRYPTING THE PASSWORD WHEN THE USER REGISTERS OR MODIFIES HIS PASSWORD or HASHING THE PASSWORD 
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });
  
  //COMPARING THE USER PASSWORD ENTERED BY USER WITH THE USER SAVED PASSWORD or COMPARING THE PASSWORD
  userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  //GENERATING A JWT TOKEN WHEN A USER REGISTERS OR LOGINS, IT DEPENDS ON OUR CODE THAT WHEN DO WE NEED TO GENERATE THE JWT TOKEN WHEN THE USER LOGIN OR REGISTER OR FOR BOTH.  or GENERATING A JWT TOKEN FOR AUTHORIZATION
  userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  };

// Method to check password strength
// userSchema.methods.isPasswordStrong = function () {
//   return passwordRegex.test(this.password);
// };

  export const User = mongoose.model("User", userSchema);

  // module.exports = User;
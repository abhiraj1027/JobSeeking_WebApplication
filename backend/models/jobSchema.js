import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title."],
    minLength: [3, "Title must contain at least 3 characters!"],
    maxLength: [30, "Title cannot exceed 30 characters!"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description."],
    minLength: [30, "Description must contain at least 30 characters!"],
    maxLength: [500, "Description cannot exceed 500 characters!"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category."],
    enum: {
      values: [
        "Painter",
        "Cleaner",
        "Sweeper",
        "Cook",
        "Househelper",
        "Driver",
        "Waiter",
        "Watchman",
        "Dishwasher",
        "Electrician",
        "Maid",
        "Porter",
        "Web Development",
        "App Development",
        "UI/UX Design",
        "Graphics Design",
        "Digital Marketing",
        "Business Development",
        "MERN Stack Development",
        "MEAN Stack Development",
        "Data Science",
        "Machine Learning",
        "DevOps",
        "Cloud",
        "QA/Testing",
        "Finance",
        "Healthcare",
        "Sales",
        "Education",
        "Other"
      ],
      message: "{VALUE} is not a valid category.",
    },
  },
  country: {
    type: String,
    required: [true, "Please provide a country name."],
  },
  city: {
    type: String,
    required: [true, "Please provide a city name."],
  },
  location: {
    type: String,
    required: [true, "Please provide a location."],
    minLength: [3, "Location must contain at least 3 characters!"],
  },
  fixedSalary: {
    type: Number,
    min: [1000, "Fixed salary must be at least 4 digits."],
    max: [100000000, "Fixed salary cannot exceed 9 digits."],
    validate: {
      validator: function(value) {
        return value >= 0; // Ensure fixed salary is not negative
      },
      message: "Fixed salary cannot be negative.",
    },
  },
  salaryFrom: {
    type: Number,
    min: [1000, "Salary must be at least 4 digits."],
    max: [100000000, "Salary cannot exceed 9 digits."],
    validate: {
      validator: function(value) {
        return value >= 0; // Ensure salaryFrom is not negative
      },
      message: "Salary from cannot be negative.",
    },
  },
  salaryTo: {
    type: Number,
    min: [1000, "Salary must be at least 4 digits."],
    max: [100000000, "Salary cannot exceed 9 digits."],
    validate: {
      validator: function(value) {
        return value >= 0; // Ensure salaryTo is not negative
      },
      message: "Salary to cannot be negative.",
    },
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", jobSchema);

import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";

// ✅ GET ALL JOBS with Filters and Search Term
export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const { city, minSalary, maxSalary, category, search } = req.query;

  const filter = { expired: false };

  // Handle the search term for job title
  if (search) {
    filter.title = { $regex: search, $options: "i" }; // Case-insensitive search
  }

  // Handle the city filter
  if (city) filter.city = city;

  // Handle the category filter
  if (category && category !== "all") filter.category = category;

  // Validate salary values before adding to filter
  if (minSalary && Number(minSalary) < 0) {
    return next(new ErrorHandler("Min salary cannot be negative.", 400));
  }
  if (maxSalary && Number(maxSalary) < 0) {
    return next(new ErrorHandler("Max salary cannot be negative.", 400));
  }

  // Handle salary range filters for both fixedSalary and salaryFrom/salaryTo
  if (minSalary || maxSalary) {
    filter.$or = [];

    // Fixed salary filter
    const fixed = {};
    if (minSalary) fixed.fixedSalary = { $gte: Number(minSalary) };
    if (maxSalary) {
      fixed.fixedSalary = {
        ...(fixed.fixedSalary || {}),
        $lte: Number(maxSalary),
      };
    }
    if (Object.keys(fixed).length) filter.$or.push(fixed);

    // Salary range filter (from salaryFrom to salaryTo)
    const range = {};
    if (minSalary) range.salaryFrom = { $gte: Number(minSalary) };
    if (maxSalary) {
      range.salaryTo = {
        ...(range.salaryTo || {}),
        $lte: Number(maxSalary),
      };
    }
    if (Object.keys(range).length) filter.$or.push(range);
  }

  try {
    const jobs = await Job.find(filter).sort({ jobPostedOn: -1 });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    return next(new ErrorHandler("Error fetching jobs.", 500));
  }
});

// ✅ POST JOB
export const postJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return res.redirect("/job/getall");
  }

  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  // Check if required fields are provided
  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("Please provide full job details", 400));
  }

  // Ensure salary values are non-negative
  if ((salaryFrom && Number(salaryFrom) < 0) || (salaryTo && Number(salaryTo) < 0) || (fixedSalary && Number(fixedSalary) < 0)) {
    return next(new ErrorHandler("Salary values cannot be negative.", 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler("Please either provide fixed salary or ranged salary.", 400)
    );
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler("Cannot enter both fixed and ranged salary.", 400)
    );
  }

  const postedBy = req.user._id;

  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });

  res.status(200).json({
    success: true,
    message: "Job Posted Successfully!",
    job,
  });
});

// ✅ GET MY JOBS
export const getMyJobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker is not allowed to access this resource", 400)
    );
  }

  const myJobs = await Job.find({ postedBy: req.user._id });

  res.status(200).json({
    success: true,
    myJobs,
  });
});

// ✅ UPDATE JOB
export const updateJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker is not allowed to access this resource", 400)
    );
  }

  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }

  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Job Updated!",
  });
});

// ✅ DELETE JOB
export const deleteJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker is not allowed to access this resource", 400)
    );
  }

  const { id } = req.params;
  const job = await Job.findById(id);

  if (!job) {
    return next(new ErrorHandler("OOPS ! Job not found", 404));
  }

  await Job.deleteOne({ _id: id });

  res.status(200).json({
    success: true,
    message: "Job deleted successfully",
  });
});

// ✅ GET SINGLE JOB
export const getSingleJob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("Job not found.", 404));
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404));
  }
});

// ✅ GET ALL CATEGORIES
export const getCategories = catchAsyncError(async (req, res, next) => {
  try {
    const categories = await Job.distinct("category");
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return next(new ErrorHandler("Error fetching categories.", 500));
  }
});

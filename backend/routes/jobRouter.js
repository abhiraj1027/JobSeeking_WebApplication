import express from "express";
import { 
  deleteJob, 
  getAllJobs, 
  getMyJobs, 
  postJob, 
  getSingleJob, 
  updateJob, 
  getCategories 
} from "../controllers/jobController.js";
import { isAuthorized } from "../middlewares/auth.js";
import { checkRole } from "../middlewares/checkRole.js"; // Custom middleware to check roles

const router = express.Router();

// Route to get all jobs with filters (query params)
router.get("/getall", getAllJobs);

// Route to get all job categories (for filters)
router.get("/getCategories", getCategories);

// Route to post a new job (authorized as employer)
router.post("/post", isAuthorized, checkRole('Employer'), postJob);

// Route to get jobs posted by the current user (authorized as employer)
router.get("/getmyjobs", isAuthorized, checkRole('Employer'), getMyJobs);

// Route to update a job (authorized as employer)
router.put("/update/:id", isAuthorized, checkRole('Employer'), updateJob);

// Route to delete a job (authorized as employer)
router.delete("/delete/:id", isAuthorized, checkRole('Employer'), deleteJob);

// Route to get a single job by ID
router.get("/:id", isAuthorized, getSingleJob);

export default router;

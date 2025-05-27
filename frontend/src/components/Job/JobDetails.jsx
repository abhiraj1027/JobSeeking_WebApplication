import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const JobDetails = () => {
  const { id } = useParams(); // Getting job id from URL params
  const [job, setJob] = useState(null); // State for holding the job details
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context); // Accessing user data and authorization status

  useEffect(() => {
    // Fetch job details based on job id
    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job); // Setting the job data to the state
      })
      .catch((error) => {
        navigateTo("/notfound"); // Navigate to a "not found" page if the job is not found
      });
  }, [id, navigateTo]);

  // Redirecting unauthorized users to the login page
  if (!isAuthorized) {
    navigateTo("/login");
    return null; // Prevent rendering until the user is redirected
  }

  // If job is not loaded yet, show loading spinner or placeholder
  if (!job) {
    return <div>Loading...</div>;
  }

  // Formatting the job posting date (Assuming the date format is ISO 8601)
  const jobPostedDate = new Date(job.jobPostedOn);
  const formattedDate = jobPostedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>
            Title: <span>{job.title}</span>
          </p>
          <p>
            Category: <span>{job.category}</span>
          </p>
          <p>
            Country: <span>{job.country}</span>
          </p>
          <p>
            City: <span>{job.city}</span>
          </p>
          <p>
            Location: <span>{job.location}</span>
          </p>
          <p>
            Description: <span>{job.description}</span>
          </p>
          <p>
            Job Posted On: <span>{formattedDate}</span>
          </p>
          <p>
            Salary:{" "}
            {job.fixedSalary ? (
              <span>{job.fixedSalary}</span>
            ) : (
              <span>
                {job.salaryFrom} - {job.salaryTo}
              </span>
            )}
          </p>
          {/* If the user is an Employer, no apply button */}
          {user && user.role === "Employer" ? (
            <></>
          ) : (
            <Link to={`/application/${job._id}`} className="applyBtn">
              Apply Now
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;

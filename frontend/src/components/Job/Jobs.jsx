import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  const [searchInput, setSearchInput] = useState("");   // raw input
  const [searchTerm, setSearchTerm] = useState("");      // finalized term
  const [category, setCategory] = useState("all");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Categories on Mount
  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    }

    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/job/getCategories",
          { withCredentials: true }
        );
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, [isAuthorized, navigateTo]);

  // Fetch Jobs when filters/search change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      // Validate salary inputs before making the API call
      if (Number(salaryFrom) < 0 || Number(salaryTo) < 0) {
        setError("Salary values cannot be negative.");
        setLoading(false);
        return;
      }

      try {
        const salaryStart = salaryFrom ? Number(salaryFrom) : 0;
        const salaryEnd = salaryTo ? Number(salaryTo) : 100000000;

        // Construct the API URL dynamically with the correct query params
        const url = `http://localhost:4000/api/v1/job/getall?search=${searchTerm}&category=${category}&salaryFrom=${salaryStart}&salaryTo=${salaryEnd}`;
        console.log("API Request URL:", url); // Log the final URL to check the query parameters

        const res = await axios.get(url, { withCredentials: true });
        setJobs(res.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm, category, salaryFrom, salaryTo]);

  // Handle live search typing with slight delay (debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  const handleResetFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setCategory("all");
    setSalaryFrom("");
    setSalaryTo("");
  };

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>

        {/* Filters and Search Bar */}
        <div className="filters-container">
          {/* Category Filter */}
          <div className="filter-section">
            <label className="filter-label" htmlFor="category">Category:</label>
            <select
              id="category"
              className="filter-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Salary Range Filter */}
          {/* <div className="filter-section">
            <label className="filter-label" htmlFor="salary">Salary Range:</label>
            <input
              type="number"
              className="filter-input"
              placeholder="From"
              value={salaryFrom}
              onChange={(e) => setSalaryFrom(e.target.value)}
              min="0"
            />
            <input
              type="number"
              className="filter-input"
              placeholder="To"
              value={salaryTo}
              onChange={(e) => setSalaryTo(e.target.value)}
              min="0"
            />
          </div> */}

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by job title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Reset Filters Button */}
          <button className="reset-filters-btn" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && <p>Loading jobs...</p>}

        {/* Error Handling */}
        {error && <p className="error-message">{error}</p>}

        {/* Job Listings */}
        <div className="banner">
          {!loading && jobs.length === 0 ? (
            <p>No jobs found. Try a different search or filter!</p>
          ) : (
            jobs.map((element) => (
              <div className="card" key={element._id}>
                <p><strong>{element.title}</strong></p>
                <p>{element.category}</p>
                <p>{element.country}</p>
                <Link to={`/job/${element._id}`}>Job Details</Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Jobs;

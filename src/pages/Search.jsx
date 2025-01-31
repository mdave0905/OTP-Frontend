import React, { useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/Navbar";
import CourseSearchResultItem from "../components/CourseSearchResultItem";
import TutorSearchResultItem from "../components/TutorSearchResultItem";
import { BACKEND_URL } from "../config";

function Search() {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const courseName = query.get("courseName");
  const tutorName = query.get("tutorName");
  const categoryName = query.get("categoryName");

  const fetchSearchResults = useCallback(async () => {
    if (courseName || tutorName || categoryName) {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (courseName) queryParams.append("courseName", courseName);
        if (tutorName) queryParams.append("tutorName", tutorName);
        let response;
        if (categoryName) {
          response = await fetch(
            `${BACKEND_URL}/search/category/${categoryName}`,
          );
        } else {
          response = await fetch(`${BACKEND_URL}/search?${queryParams}`);
        }
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setSearchResults(data);
        } else {
          setError("Error fetching search results.");
        }
      } catch (err) {
        setError("An error occurred while fetching the search results.");
      } finally {
        setLoading(false);
      }
    }
  }, [courseName, tutorName, categoryName]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  return (
    <div className="flex flex-col items-center w-full bg-white overflow-hidden">
      <NavBar currentPage="/" />
      {loading && (
        <div className="mt-[150px] font-merriweather_sans text-xl">
          Loading...
        </div>
      )}
      {!loading && error && (
        <div className="mt-[150px] font-merriweather_sans">{error}</div>
      )}

      {!loading && !error && searchResults?.length > 0 && (
        <div className="w-full max-w-4xl mt-[150px] font-merriweather_sans">
          <div className="mt-4">
            <label className="block text-lg font-bold">Filter by Rating:</label>
            <select
              className="mt-2 p-2 border rounded-md"
              value={ratingFilter || ""}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Star</option>
            </select>
          </div>

          {courseName && (
            <span className="block font-merriweather_sans text-xl my-5">
              {
                searchResults.filter(
                  (result) =>
                    !ratingFilter ||
                    result.averageRating >= parseFloat(ratingFilter),
                ).length
              }{" "}
              result(s) for '{courseName}'
            </span>
          )}
          {tutorName && (
            <span className="block font-merriweather_sans text-xl my-5">
              {
                searchResults.filter(
                  (result) =>
                    !ratingFilter ||
                    result.averageRating >= parseFloat(ratingFilter),
                ).length
              }{" "}
              result(s) for '{tutorName}'
            </span>
          )}
          {categoryName && (
            <span className="block font-merriweather_sans text-xl my-5">
              {
                searchResults.filter(
                  (result) =>
                    !ratingFilter ||
                    result.averageRating >= parseFloat(ratingFilter),
                ).length
              }{" "}
              result(s) for '{categoryName}'
            </span>
          )}

          <ul
            className={
              tutorName
                ? "grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4"
                : ""
            }
          >
            {searchResults
              .filter((result) => {
                if (!ratingFilter) return true; // No filter applied, show all results
                return result.averageRating >= parseFloat(ratingFilter);
              })
              .map((result, index) => {
                if (courseName) {
                  return <CourseSearchResultItem course={result} key={index} />;
                }
                if (tutorName) {
                  return <TutorSearchResultItem tutor={result} key={index} />;
                }
                if (categoryName) {
                  return <CourseSearchResultItem course={result} key={index} />;
                }
                return null;
              })}
          </ul>
        </div>
      )}
      {!loading &&
        !error &&
        searchResults?.filter(
          (result) =>
            !ratingFilter || result.averageRating >= parseFloat(ratingFilter),
        ).length === 0 && (
          <div className="flex flex-col items-center w-full bg-white overflow-hidden mt-[150px]">
            {courseName && (
              <span className="font-merriweather_sans text-xl m-5">
                No results found for '{courseName}'
              </span>
            )}
            {tutorName && (
              <span className="font-merriweather_sans text-xl m-5">
                No results found for '{tutorName}'
              </span>
            )}
            {categoryName && (
              <span className="font-merriweather_sans text-xl m-5">
                No results found for '{categoryName}'
              </span>
            )}
          </div>
        )}
    </div>
  );
}

export default Search;

import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";

const SearchBar = ({ infoFunc }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownData, setDropdownData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null); // State to hold error message

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: searchTerm }),
      });

      if (result.ok) {
        const data = await result.json();
        setDropdownData(data); // Set dropdown data based on search results
        setErrorMessage(null); // Reset error message if request succeeds
      } else {
        setErrorMessage("An error occurred while fetching search results.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  const submitAuthorRequest = async (authorId) => {
    try {
      const result = await fetch("http://localhost:8000/author/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author_id: authorId }),
      });

      if (result.ok) {
        const data = await result.json();
        infoFunc(data); // Send author details to parent component
        setErrorMessage(null); // Reset error message if request succeeds
      } else {
        infoFunc(null); // Send empty object to parent component
        setErrorMessage("An error occurred while fetching author details.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="absolute top-20 flex items-center w-full justify-center">
      <form onSubmit={handleFormSubmit}>
        <div className="control relative">
          <span>
            <CiSearch className="absolute top-2 left-4" />
          </span>
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            className="p-1 pl-10 w-[150px] focus:w-[800px] duration-300 transition-all sm-w-[400px] rounded-full focus:outline-gray-400 placeholder-gray-400"
            placeholder="Search"
          />
        </div>
      </form>
      <div className="absolute top-10 flex items-center w-full justify-center">
        {dropdownData.length > 0 && (
          <div className="dropdown mt-2">
            <select
              onChange={(e) => submitAuthorRequest(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select an author</option>
              {dropdownData.map((item) => (
                <option key={item.author_id} value={item.author_id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {/* {errorMessage && (
        <div className="absolute top-16 flex items-center w-full justify-center">
          <p className="text-red-500">{errorMessage}</p>
        </div>
      )} */}
    </div>
  );
};

export default SearchBar;

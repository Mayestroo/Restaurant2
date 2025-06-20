import React, { useState } from "react";

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <section className="search fixed w-full bg-white mt-48 shadow">
      <div className="relative max-w-[905px] w-full m-auto py-3">
        <input
          placeholder="Xayolingizdagi eng shirin lazzatni bu yerdan izlang..."
          className="w-full rounded-full outline-none border-2 border-[#3B82F6] py-2 pl-5 pr-12 text-base placeholder:opacity-0 min-[480px]:placeholder:opacity-100 md:text-lg"
          value={query}
          onChange={handleInputChange}
        />
        <div className="absolute right-2 bottom-5 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 md:w-5 md:h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Search;

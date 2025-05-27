import React, { useState, useEffect } from "react";
import { MealsProvider } from "../../context/MealContext";
import Navbar from "../../components/Navbar";
import Categories from "../../components/Categories";
import MealContainer from "../../components/MealContainer";
import Search from "../../components/Search";
import Aside from "./../../components/Aside/index";

const User = () => {
  const [selectedType, setSelectedType] = useState(() => {
    try {
      const saved = localStorage.getItem("selectedType");
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error("Error parsing selectedType from localStorage:", err);
      return null;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedType) {
      localStorage.setItem("selectedType", JSON.stringify(selectedType));
    }
  }, [selectedType]);

  return (
    <MealsProvider>
      <section className="layout flex   flex-col lg:flex-row   w-full min-h-screen bg-[#F7F7F7] bg-auto">
        <div className="flex-1 flex flex-col gap-5 p-5">
          <Navbar />
          <Categories setSelectedType={setSelectedType} />
          <Search onSearch={setSearchQuery} />
          {selectedType && (
            <MealContainer
              selectedType={selectedType}
              searchQuery={searchQuery}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="aside-in block">
          <Aside />
        </div>
      </section>
    </MealsProvider>
  );
};

export default User;

import React, { useState, useEffect } from "react";
import Categories from "../../../components/Categories";
import MealContainer from "../../../components/MealContainer";
import WaiterMealCard from "../../../components/WaiterMealCard";
import Search from "../../../components/Search";
import WaiterBasket from "../../../components/WaiterBasket";
import WaiterAside from "../../../components/WaiterAside";

const WAITER_SELECTED_TYPE_KEY = "waiter_selectedType";

const WaiterMenu = () => {
  const [selectedType, setSelectedType] = useState(() => {
    try {
      const saved = localStorage.getItem(WAITER_SELECTED_TYPE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error("Error parsing waiter_selectedType from localStorage:", err);
      return null;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (selectedType) {
      localStorage.setItem(WAITER_SELECTED_TYPE_KEY, JSON.stringify(selectedType));
    }
  }, [selectedType]);

  return (
    <section className="meals layout flex flex-col lg:flex-row w-[100vw] min-h-screen bg-[#F7F7F7] bg-auto">
      <div className="flex-1 flex flex-col gap-5">
        <Categories setSelectedType={setSelectedType} />
        <Search onSearch={setSearchQuery} />
        {selectedType && (
          <MealContainer
            selectedType={selectedType}
            searchQuery={searchQuery}
            CardComponent={WaiterMealCard} 
          />
        )}
        <WaiterBasket onClick={() => setShowModal(true)} />
      </div>
      <div className="aside-in block">
        <WaiterAside showModal={showModal} setShowModal={setShowModal} />
      </div>
    </section>
  );
};

export default WaiterMenu;

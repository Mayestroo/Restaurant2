import React, { useEffect, useState } from "react";
import getCategory from "../../api/category";
import { Link } from "react-router-dom";

const Categories = ({ setSelectedType }) => {
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState("Hammasi");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await getCategory(token);
      if (error) {
        setError(error);
      } else {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, [token]);

  const totalCount = categories.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );
  const hammasiCard = { name: "Hammasi", count: totalCount };
  const allCards = [hammasiCard, ...categories];

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedType(hammasiCard);
    }
  }, [categories]);

  const handleItemClick = (item) => {
    setSelectedItem(item.name);
    setSelectedType(item);
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="text-center text-gray-500 py-4">Yuklanmoqda...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">
          Kategoriya yuklashda xatolik
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1 sm:px-2">
          {allCards.map((item, index) => (
            <Link
              key={index}
              onClick={() => handleItemClick(item)}
              className={`min-w-[120px] sm:min-w-[135px] max-w-[150px] rounded-2xl p-3 flex-shrink-0 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedItem === item.name
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "bg-white"
              }`}
            >
              <div
                className="w-[35px] h-[35px] rounded-full transition mx-auto"
                style={{
                  backgroundColor:
                    selectedItem === item.name ? "#3B82F6" : "#F7F7F7",
                }}
              />
              <div className="font-medium mt-4 text-sm text-gray-700 truncate text-center">
                {item.name}
              </div>
              <p className="text-xs text-gray-500 text-center">
                {item.count} xil
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;

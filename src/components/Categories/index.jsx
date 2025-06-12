import { useEffect, useState } from "react";
import getCategory from "../../api/category";
import { Link } from "react-router-dom";

const Categories = ({ setSelectedType }) => {
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState("Hammasi");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await getCategory(token);
      setCategories(data);
    };

    fetchCategories();
  }, [token]);

  const totalMealCount = categories.reduce(
    (sum, item) => sum + (item.mealCount || 0),
    0
  );

  const hammasiCard = { name: "Hammasi", mealCount: totalMealCount };
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
    <div className="w-full mt-16 fixed bg-white">
      <div className="categories flex gap-3 overflow-x-auto no-scrollbar py-2 px-1 sm:px-2">
        {allCards.map((item, index) => (
          <Link
            key={index}
            onClick={() => handleItemClick(item)}
            className={`min-w-[120px] sm:min-w-[135px] max-w-[150px] rounded-2xl p-3 flex-shrink-0 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md ${selectedItem === item.name
              ? "bg-red-100 border-red-500 border-2"
              : "bg-blue-100 border-2 border-blue-500"
              }`}
          >
            <div
              className="w-[35px] h-[35px] rounded-full bg-[#f63b3b] transition mx-auto"
              style={{
                backgroundColor:
                  selectedItem === item.name ? "#f63b3b" : "#3B82F6",
              }}
            />
            <div className="font-medium mt-4 text-sm text-gray-700 truncate text-center">
              {item.name}
            </div>
            <p className="text-xs text-gray-500 text-center">
              {item.mealCount} xil
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Categories;
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, Pencil, Plus } from "lucide-react";
import { toast } from "react-toastify";

const Meals = () => {
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [skip, setSkip] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mealToDelete, setMealToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    fromPrice: "",
    toPrice: "",
    categoryId: "",
  });
  const [noMealsNotified, setNoMealsNotified] = useState(false);
  const debounceTimeout = useRef(null);

  const take = 5;
  const currentPage = Math.floor(skip / take) + 1;
  const totalPages = Math.ceil(totalCount / take);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.245:5063/api/CategoryControlller/AllCategories"
      );
      const result = response.data.result;
      console.log("Categories fetched:", result);
      if (Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        throw new Error("Categories data is not an array");
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Kategoriya yuklashda xatolik yuz berdi.");
    }
  };

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      const fromPrice = filters.fromPrice ? parseFloat(filters.fromPrice) : 0;
      const toPrice = filters.toPrice ? parseFloat(filters.toPrice) : 0;
      const categoryId = filters.categoryId ? parseInt(filters.categoryId) : 0;

      if (fromPrice > toPrice && toPrice !== 0) {
        toast.error(
          "Narx diapazoni noto‘g‘ri. 'From' narxi 'To' narxidan kichik yoki teng bo‘lishi kerak."
        );
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://192.168.1.245:5063/api/Meal/Meals",
        {
          name: filters.name || "",
          fromPrice,
          toPrice,
          categoryId,
          skip,
          take,
        }
      );

      console.log("Meals API response:", response.data);

      const data = response.data.result;
      if (!data || !Array.isArray(data.data)) {
        throw new Error("Ovqatlar ma'lumotlari noto‘g‘ri formatda");
      }

      setMeals(data.data);
      setTotalCount(data.total_counts || 0);

      const newTotalPages = Math.ceil(data.total_counts / take);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setSkip((newTotalPages - 1) * take);
      }

      if (data.data.length === 0 && skip === 0 && !noMealsNotified) {
        toast.info(
          filters.name ||
            filters.fromPrice ||
            filters.toPrice ||
            filters.categoryId
            ? "Filtrlaringizga mos keladigan ovqat topilmadi"
            : "Ovqatlar topilmadi"
        );
        setNoMealsNotified(true);
      } else if (data.data.length > 0) {
        setNoMealsNotified(false);
      }
    } catch (error) {
      console.error("Ovqatlarni olishda xatolik:", error);
      toast.error(`Ovqatlar yuklanmadi: ${error.message}`);
      setMeals([]);
      setTotalCount(0);
      setNoMealsNotified(false);
    } finally {
      setLoading(false);
    }
  }, [filters, skip, take, currentPage, noMealsNotified]);

  const debouncedFetchMeals = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      fetchMeals();
    }, 500);
  }, [fetchMeals]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSkip(0);
    setNoMealsNotified(false);
    debouncedFetchMeals();
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      fromPrice: "",
      toPrice: "",
      categoryId: "",
    });
    setSkip(0);
    setNoMealsNotified(false);
    debouncedFetchMeals();
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://192.168.1.245:5063/api/Meal/Meal?mealId=${id}`,
        {
          headers: { Accept: "text/plain" },
        }
      );
      if (response.data.statusCode === 200) {
        toast.success("Ovqat muvaffaqiyatli o‘chirildi");
        debouncedFetchMeals();
      } else {
        throw new Error(response.data.error || "Ovqatni o‘chirishda xatolik");
      }
    } catch (error) {
      console.error("Ovqatni o‘chirishda xatolik:", error);
      toast.error(
        `Ovqatni o‘chirishda xatolik: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setMealToDelete(null);
    }
  };

  const goToPage = (page) => {
    const newSkip = (page - 1) * take;
    setSkip(newSkip);
    debouncedFetchMeals();
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-meal/${id}`);
  };

  const openDeleteModal = (meal) => {
    setMealToDelete(meal);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setMealToDelete(null);
  };

  useEffect(() => {
    fetchCategories();
    debouncedFetchMeals();
  }, [debouncedFetchMeals]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Meals</h2>

        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by Name
            </label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Enter meal name"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range (so'm)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="fromPrice"
                value={filters.fromPrice}
                onChange={handleFilterChange}
                placeholder="From"
                className="w-1/2 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                min="0"
                step="0.01"
              />
              <input
                type="number"
                name="toPrice"
                value={filters.toPrice}
                onChange={handleFilterChange}
                placeholder="To"
                className="w-1/2 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="categoryId"
              value={filters.categoryId}
              onChange={handleFilterChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              aria-label="Clear filters"
            >
              Clear Filters
            </button>
            <button
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => navigate("/dashboard/add-meal")}
              aria-label="Add new meal"
            >
              <Plus size={20} className="mr-2" />
              Add Meal
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                    Meal Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                    Price (so'm)
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                    Quantity
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      Loading meals...
                    </td>
                  </tr>
                ) : meals.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No meals available
                    </td>
                  </tr>
                ) : (
                  meals.map((meal) => (
                    <tr key={meal.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{meal.name}</td>
                      <td className="py-3 px-4 text-sm">
                        {meal.categoryName || "No Category"}
                      </td>
                      <td className="py-3 px-4 text-sm">{meal.price} so‘m</td>
                      <td className="py-3 px-4 text-sm">{meal.quantity}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleEdit(meal.id)}
                          className="text-blue-600 hover:text-blue-700"
                          aria-label="Edit meal"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(meal)}
                          className="ml-2 text-red-600 hover:text-red-700"
                          aria-label="Delete meal"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-end items-center space-x-2">
          <button
            onClick={() => goToPage(1)}
            disabled={skip === 0}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            aria-label="First page"
          >
            First
          </button>

          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={skip === 0}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            aria-label="Previous page"
          >
            Prev
          </button>

          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page + 1)}
              className={`px-4 py-2 text-sm font-medium ${
                currentPage === page + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              } rounded-lg hover:bg-gray-300`}
              aria-label={`Page ${page + 1}`}
            >
              {page + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={skip + take >= totalCount}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            aria-label="Next page"
          >
            Next
          </button>

          <button
            onClick={() => goToPage(totalPages)}
            disabled={skip + take >= totalCount}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            aria-label="Last page"
          >
            Last
          </button>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Are you sure you want to delete this meal?
              </h3>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(mealToDelete.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meals;

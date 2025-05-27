import React, { useState } from "react";
import loginApi from "../../api/loginApi"; // 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Auth() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ login: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.login || !formData.password) {
      setError("Iltimos, login va parolni kiriting.");
      setLoading(false);
      return;
    }

    try {
      const response = await loginApi.post("/token", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { access_token, refresh_token } = response.data.result;

      if (!access_token || !refresh_token) {
        throw new Error("Login muvaffaqiyatsiz.");
      }

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      const decoded = decodeToken(access_token);
      if (!decoded) throw new Error("Tokenni o‘qib bo‘lmadi.");

      const roleId = Number(decoded.roleId || decoded.RoleId || decoded.RoleID);

      toast.success("Muvaffaqiyatli tizimga kirildi!");

      if (roleId === 1 || roleId === 4) navigate("/dashboard");
      else if (roleId === 2) navigate("/waiter");
      else if (roleId === 3) navigate("/cooker");
      else navigate("/unauthorized");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Noto‘g‘ri login yoki parol.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Tizimga kirish</h2>

        {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Login</label>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            autoComplete="username"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Parol</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
        >
          {loading ? "Kirish..." : "Kirish"}
        </button>
      </form>
    </div>
  );
}

export default Auth;

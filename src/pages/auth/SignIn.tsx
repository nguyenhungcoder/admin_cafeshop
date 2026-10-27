import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import { loginApi } from "../../services/auth.api";

export const SignIn = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formDataSignIn, setFormDataSignIn] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataSignIn({
      ...formDataSignIn,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Gọi API gửi dữ liệu đăng nhập đến Quarkus (Cổng 8081)
      const res = await loginApi(formDataSignIn);

      // 🌟 2. CHỐT CHẶN BẢO MẬT: Kiểm tra xem tài khoản có chức vụ ADMIN không
      if (res.role !== "ADMIN") {
        toast.error(
          "Tài khoản của bạn không có quyền truy cập vào khu vực Quản trị! ⛔",
        );
        return; // Ngắt luồng ngay lập tức, không cho lưu session, không cho chuyển trang
      }

      // 🌟 3. THAY THẾ MÃ GIẢ: Lấy chuỗi Token JWT xịn được đóng dấu từ Quarkus trả về
      const user = res;
      const token = res.token; // Đã đổi res.token thay cho "dummy-token-for-now" cũ

      // Lưu lại token vào máy để Axios Interceptor (`auth.api.ts`) tự động đính kèm vào Header
      localStorage.setItem("admin_token", token);

      // 4. Đồng bộ dữ liệu vào Auth Store của dự án (Lưu vào LocalStorage / Zustand)
      login(user, token);

      toast.success("Chào mừng Admin quay trở lại 👋☕");

      // 5. Điều hướng thẳng vào trang quản trị
      navigate("/");
    } catch (error: any) {
      console.error(error);
      // Đọc thông báo lỗi dạng JSON map {"message": "..."} từ Quarkus
      const errorMsg =
        error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT - Branding */}
      <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12">
        <h1 className="text-4xl font-bold mb-4">Welcome back 👋</h1>
        <p className="text-lg opacity-80">
          Manage your coffee shop system like a pro.
        </p>
      </div>

      {/* RIGHT - FORM */}
      <div className="flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Sign in
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={formDataSignIn.email}
                onChange={handleChange}
                placeholder="admin@cafeshop.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={formDataSignIn.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

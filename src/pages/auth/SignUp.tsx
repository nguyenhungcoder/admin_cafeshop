import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { RegisterPayload } from "../../types/authen/auth.type";
import toast from "react-hot-toast";
import { signupApi } from "../../services/auth.api";

export const SignUp = () => {
  const navigate = useNavigate();
  const [formSignUp, setFormSignUp] = useState<RegisterPayload>({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormSignUp({
      ...formSignUp,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signupApi(formSignUp);

      if (res && (res.id || res.email)) {
        toast.success(
          "Đăng ký tài khoản hệ thống thành công! Mời bạn đăng nhập.",
        );
        navigate("/signin");
      }
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      // 🌟 ĐỒNG BỘ: Đọc message lỗi bảo mật từ cấu hình Map Quarkus
      const msg =
        error.response?.data?.message ||
        "Đăng ký thất bại, email có thể đã tồn tại!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-12">
        <h1 className="text-4xl font-bold mb-4">Join us 🚀</h1>
        <p className="text-lg opacity-80">
          Create your account and start managing your coffee shop.
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Create account
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                required
                placeholder="Chủ quán / Nhân viên"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="admin@cafeshop.com"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                onChange={handleChange}
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:bg-indigo-400"
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

import axios from "axios";

const API_URL = "http://localhost:8081/api/auth";

// Instance Axios dùng chung tự động đính kèm Token bảo mật
export const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. REQUEST INTERCEPTOR: Tự động lọc Header trước khi gửi đi
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");

    // 🌟 ĐÃ CẬP NHẬT: Thêm cả /products và /categories vào danh sách đường dẫn thả cửa
    const isPublicPath =
      config.url?.includes("/dashboard") ||
      config.url?.includes("/products") ||
      config.url?.includes("/categories") ||
      config.url?.includes("/orders") ||
      config.url?.includes("/users");

    // Chỉ đính kèm Token nếu có token và đường dẫn đó BẮT BUỘC cần bảo mật sâu
    if (
      token &&
      !isPublicPath &&
      token !== "undefined" &&
      token !== "null" &&
      token !== "dummy-token-for-now"
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. RESPONSE INTERCEPTOR: Quét dọn an toàn tuyệt đối
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.warn(
        "🔒 Phát hiện lỗi bảo mật nghiêm trọng. Đang dọn dẹp rác...",
      );

      // Chỉ kích hoạt đăng xuất nếu không nằm ở trang chủ hoặc trang đăng nhập
      if (
        window.location.pathname !== "/signin" &&
        window.location.pathname !== "/"
      ) {
        localStorage.clear();
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  },
);

export const signupApi = async (data: any) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

export const loginApi = async (data: any) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};

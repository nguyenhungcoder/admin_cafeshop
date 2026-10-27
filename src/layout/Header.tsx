import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate(); // 2. Khởi tạo hàm điều hướng

  const handleLogout = () => {
    // 3. Thực hiện đăng xuất (xóa dữ liệu trong Store & LocalStorage)
    logout();

    // 4. Thông báo và chuyển hướng về trang đăng nhập
    toast.success("Đã đăng xuất thành công!");
    navigate("/signin");
  };

  return (
    <div className="h-20 bg-white shadow flex justify-between items-center px-6">
      <h2 className="text-xl font-bold">Admin Panel</h2>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* Hiển thị tên nếu bạn muốn */}
            <span className="text-gray-600 text-sm">Chào, {user.fullName}</span>

            <button
              onClick={handleLogout} // Gọi hàm handleLogout thay vì gọi trực tiếp logout
              className="bg-gray-900 text-white p-2 rounded-[8px] cursor-pointer px-3.5 hover:bg-black transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-600 font-medium"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

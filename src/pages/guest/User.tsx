import React, { useEffect, useState } from "react";
// 🌟 THAY ĐỔI: Gọi instance api thông minh để tự động bơm JWT Token công khai
import { api } from "../../services/auth.api";
import toast, { Toaster } from "react-hot-toast";

interface UserCustomer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

export const User = () => {
  const [customers, setCustomers] = useState<UserCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm gọi API lấy danh sách người dùng và lọc giữ lại quyền USER
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");

      // Lọc dữ liệu ngay tại Frontend: Chỉ hiển thị những người mua hàng (Role là USER)
      const onlyUsers = res.data.filter(
        (u: UserCustomer) => u.role?.toUpperCase() === "USER",
      );

      // Sắp xếp ID mới nhất lên đầu bảng giống hóa đơn
      const sortedData = onlyUsers.sort(
        (a: UserCustomer, b: UserCustomer) => b.id - a.id,
      );
      setCustomers(sortedData);
    } catch (error) {
      console.error("Lỗi lấy danh sách khách hàng:", error);
      toast.error("Không thể tải danh sách khách hàng! 👥");
    } finally {
      setLoading(false);
    }
  };

  // Tính năng xóa tài khoản khách hàng trực tiếp xuống CSDL Quarkus
  const handleDelete = async (id: number) => {
    if (
      window.confirm("⚠️ Bạn có chắc chắn muốn xóa tài khoản khách hàng này?")
    ) {
      try {
        // Gọi lên API xóa người dùng: /api/users/{id}
        await api.delete(`/users/${id}`);
        toast.success("Đã xóa tài khoản khách hàng! 🗑️");
        fetchCustomers(); // Tải lại danh sách sau khi xóa thành công
      } catch (error) {
        toast.error("Lỗi khi xóa tài khoản.");
      }
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">
        {/* Phần tiêu đề giống hệt hóa đơn */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Quản Lý Khách Hàng 👥
          </h2>
          <button
            onClick={fetchCustomers}
            className="text-sm bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            Làm mới
          </button>
        </div>

        {/* Khung chứa bảng bo góc bo tròn 2rem chuẩn phong cách hóa đơn */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Mã số
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Họ và Tên
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Email liên hệ
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Địa chỉ mặc định
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-gray-400 italic"
                  >
                    ☕ Đang tải danh sách người mua hàng...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-gray-400 italic"
                  >
                    Chưa có người mua hàng nào đăng ký tài khoản hệ thống.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-amber-700 font-bold">
                      #{customer.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">
                      {customer.fullName || "Khách hàng"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {customer.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {customer.address || "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm active:scale-95"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

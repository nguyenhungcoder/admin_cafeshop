import React, { useEffect, useState } from "react";
// 🌟 THAY ĐỔI: Gọi instance api thông minh để tự động bơm JWT Token
import { api } from "../../services/auth.api";
import toast, { Toaster } from "react-hot-toast";

interface Invoice {
  id: number;
  orderId: string;
  orderDate: string;
  status: string;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
}

export const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [prevCount, setPrevCount] = useState(0);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      // 🌟 THAY ĐỔI: Sử dụng api dùng chung của dự án
      const res = await api.get("/orders");

      const sortedData = res.data.sort((a: Invoice, b: Invoice) => b.id - a.id);
      setInvoices(sortedData);

      if (sortedData.length > prevCount && prevCount !== 0) {
        toast.success("🔥 Có đơn hàng mới đặt!");
      }
      setPrevCount(sortedData.length);
    } catch (error) {
      console.error("Lỗi lấy danh sách hóa đơn:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: number) => {
    if (window.confirm("Xác nhận duyệt đơn hàng này?")) {
      try {
        // 🌟 THAY ĐỔI: Dùng api gửi lệnh phê duyệt
        await api.put(`/orders/${id}/confirm`);
        toast.success("Xác nhận đơn thành công! ✅");
        fetchInvoices();
      } catch (error) {
        toast.error("Lỗi khi xác nhận đơn hàng.");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("⚠️ Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      try {
        // 🌟 THAY ĐỔI: Dùng api gửi lệnh xóa
        await api.delete(`/orders/${id}`);
        toast.success("Đã xóa đơn hàng! 🗑️");
        fetchInvoices();
      } catch (error) {
        toast.error("Lỗi khi xóa đơn hàng.");
      }
    }
  };

  useEffect(() => {
    fetchInvoices();
    const interval = setInterval(fetchInvoices, 5000);
    return () => clearInterval(interval);
  }, [prevCount]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Quản Lý Hóa Đơn 📄
          </h2>
          <button
            onClick={fetchInvoices}
            className="text-sm bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            Làm mới
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Mã HĐ
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Ngày Giờ
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                  Tổng Tiền
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-sm text-amber-700 font-bold">
                    #{invoice.orderId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {invoice.orderDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 text-[10px] font-black rounded-full uppercase tracking-wider ${invoice.status === "Chờ xử lý" ? "bg-amber-100 text-amber-700" : invoice.status === "Đã hủy" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-800">
                    {invoice.totalPrice.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      {invoice.status === "Chờ xử lý" ? (
                        <button
                          onClick={() => handleConfirm(invoice.id)}
                          className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition shadow-sm active:scale-95"
                        >
                          Xác nhận
                        </button>
                      ) : invoice.status === "Đã hủy" ? (
                        <span className="text-xs font-bold text-red-400 italic px-4 py-1.5">
                          Đã hủy
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-gray-400 italic px-4 py-1.5">
                          Đã duyệt
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm active:scale-95"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

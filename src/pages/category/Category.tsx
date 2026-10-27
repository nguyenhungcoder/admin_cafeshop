import React, { useEffect, useState } from "react";
import { api } from "../../services/auth.api";
import toast, { Toaster } from "react-hot-toast";
import { Layers, PlusCircle, Edit3, Trash2, XCircle } from "lucide-react";

interface CategoryData {
  id?: number;
  name: string;
}

export const Category = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. LẤY DANH SÁCH DANH MỤC
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
      toast.error("Không thể tải danh sách danh mục ❌");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. XỬ LÝ LƯU (THÊM MỚI HOẶC CẬP NHẬT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Vui lòng nhập tên danh mục!");
    setLoading(true);

    try {
      if (isEditing && editId) {
        // Cập nhật danh mục cũ
        await api.put(`/categories/${editId}`, { name });
        toast.success("Cập nhật danh mục thành công ✨");
      } else {
        // Thêm danh mục mới
        await api.post("/categories", { name });
        toast.success("Thêm danh mục mới thành công ☕");
      }
      resetForm();
      fetchCategories();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Lỗi thao tác!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 3. XỬ LÝ XÓA
  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "Bạn có chắc muốn xóa danh mục này? Cần đảm bảo không có sản phẩm nào thuộc danh mục này.",
      )
    ) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success("Đã xóa danh mục!");
        fetchCategories();
      } catch (error: any) {
        toast.error("Không thể xóa! Danh mục này có thể đang chứa sản phẩm.");
      }
    }
  };

  // 4. KÍCH HOẠT CHẾ ĐỘ SỬA
  const handleEdit = (cat: CategoryData) => {
    setIsEditing(true);
    setEditId(cat.id!);
    setName(cat.name);
  };

  const resetForm = () => {
    setName("");
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Toaster position="top-right" />
      {/* Tiêu đề */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-amber-900 flex items-center gap-3">
          <Layers className="w-8 h-8 text-amber-700" />
          Quản Lý Danh Mục
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Phân loại sản phẩm cho thực đơn nhà hàng
        </p>
      </div>

      {/* Cấu trúc 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI: FORM NHẬP LIỆU */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-100 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            {isEditing ? "📝 Chỉnh sửa" : "➕ Thêm danh mục"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Tên danh mục
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Cà phê Hạt..."
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-amber-500 outline-none transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-sm transition active:scale-95 flex items-center justify-center gap-2 ${
                  isEditing
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-amber-700 hover:bg-amber-800"
                } disabled:bg-gray-400`}
              >
                {loading
                  ? "Đang xử lý..."
                  : isEditing
                    ? "CẬP NHẬT"
                    : "XÁC NHẬN THÊM"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full py-2 text-gray-400 text-xs hover:text-red-500 transition-colors uppercase font-bold flex items-center justify-center gap-1"
                >
                  <XCircle className="w-4 h-4" /> Hủy chỉnh sửa
                </button>
              )}
            </div>
          </form>
        </div>

        {/* CỘT PHẢI: BẢNG HIỂN THỊ DANH SÁCH */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-amber-50/50 border-b border-amber-100 text-amber-900 font-bold text-sm">
                  <th className="p-4 w-20 text-center">ID</th>
                  <th className="p-4">Tên danh mục</th>
                  <th className="p-4 text-center w-40">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="p-4 text-center font-bold text-gray-400">
                      #{cat.id}
                    </td>
                    <td className="p-4 font-semibold text-gray-700">
                      {cat.name}
                    </td>
                    <td className="p-4 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition shadow-sm"
                        title="Sửa danh mục"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id!)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm"
                        title="Xóa danh mục"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {categories.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-8 text-center text-gray-400 bg-gray-50/30"
                    >
                      Chưa có danh mục nào được tạo...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

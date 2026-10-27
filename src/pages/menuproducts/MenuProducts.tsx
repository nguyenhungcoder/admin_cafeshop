import React, { useEffect, useState } from "react";
// 🌟 THAY ĐỔI 1: Import api bảo mật tự gắn Token
import { api } from "../../services/auth.api";

const BASE_URL = "http://localhost:8081";

interface Product {
  id?: number;
  name: string;
  price: number;
  image_url: string;
  category_id?: number; // 🌟 ĐÃ SỬA: Chuyển sang dùng Id số
  category_name?: string;
}

interface Category {
  id: number;
  name: string;
}

export const MenuProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // 🌟 THÊM: State danh mục
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Product>({
    name: "",
    price: 0,
    image_url: "",
    category_id: 0, // 🌟 ĐÃ SỬA: Mặc định bằng Id số
  });

  const fetchMenu = async () => {
    try {
      setLoading(true);
      // 🌟 THAY ĐỔI: Dùng api dùng chung của hệ thống
      const res = await api.get(`/products?t=${new Date().getTime()}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi lấy Menu:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 THÊM: Lấy danh mục từ API về đổ vào Select Box
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
      if (res.data.length > 0 && formData.category_id === 0) {
        setFormData((prev) => ({ ...prev, category_id: res.data[0].id }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa món này?")) {
      try {
        // 🌟 THAY ĐỔI: Dùng api gửi lệnh xóa
        await api.delete(`/products/${id}`);
        fetchMenu();
      } catch (error) {
        alert("Lỗi khi xóa sản phẩm");
      }
    }
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id!);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // 🌟 THAY ĐỔI: Dùng api sửa thông tin món bằng PUT JSON
        await api.put(`/products/${editingId}`, formData);
      } else {
        // 🌟 THAY ĐỔI: Dùng api tạo thông tin món mới bằng POST JSON
        await api.post("/products", formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        name: "",
        price: 0,
        image_url: "",
        category_id: categories.length > 0 ? categories[0].id : 0,
      });
      fetchMenu();
    } catch (error) {
      alert("Lỗi khi lưu dữ liệu, vui lòng kiểm tra phân quyền!");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-amber-950 uppercase tracking-tighter">
            Menu ☕
          </h2>
          <div className="flex gap-2">
            <button
              onClick={fetchMenu}
              className="text-sm bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-[0.95]"
            >
              Làm mới
            </button>
          </div>
        </div>

        {/* Modal Thêm/Sửa */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-amber-950">
                {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Tên món"
                  required
                  className="w-full p-2 border rounded-lg text-sm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <input
                  type="number"
                  placeholder="Giá tiền"
                  required
                  className="w-full p-2 border rounded-lg text-sm"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                />

                <input
                  type="text"
                  placeholder="Tên file ảnh (vd: ca-phe-nau.jpg)"
                  required
                  className="w-full p-2 border rounded-lg text-sm"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />

                {/* 🌟 ĐÃ SỬA 2: Vòng lặp danh mục hiển thị động chuẩn DB */}
                <select
                  className="w-full p-2 border rounded-lg text-sm bg-white"
                  value={formData.category_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category_id: Number(e.target.value),
                    })
                  }
                  required
                >
                  <option value="" disabled>
                    -- Chọn danh mục --
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-amber-900 text-white py-2 rounded-lg font-bold text-sm"
                  >
                    LƯU
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-bold text-sm"
                  >
                    HỦY
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-xs font-medium text-amber-900">
            Đang tải...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col group"
              >
                <div className="h-40 w-full overflow-hidden relative bg-amber-50">
                  <img
                    src={`${BASE_URL}/uploads/${item.image_url}`}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="bg-white p-1.5 rounded-full shadow-md text-blue-600 hover:text-blue-800"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id!)}
                      className="bg-white p-1.5 rounded-full shadow-md text-red-600 hover:text-red-800"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>

                <div className="p-3 flex-grow flex flex-col">
                  <span className="text-[9px] text-amber-600 font-bold uppercase mb-1">
                    {item.category_name}
                  </span>
                  <h3 className="text-sm font-bold text-gray-800 leading-tight h-9 line-clamp-2 mb-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-black text-amber-800">
                      {Number(item.price).toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

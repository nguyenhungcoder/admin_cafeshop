import React, { useEffect, useState } from "react";
// 🌟 THAY ĐỔI: Sử dụng api bảo mật tự gắn Token
import { api } from "../../services/auth.api";
import toast, { Toaster } from "react-hot-toast";

interface Product {
  id?: number;
  name: string;
  category_id?: number;
  category_name?: string;
  price: number;
  quantity: number;
  image_url?: string;
  description: string;
  roast: string;
  weight: string;
}

interface Category {
  id: number;
  name: string;
}

export const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<Product>({
    name: "",
    category_id: 0,
    price: 0,
    quantity: 0,
    image_url: "",
    description: "",
    roast: "Medium",
    weight: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      // 🌟 THAY ĐỔI: Chuyển sang dùng api dùng chung
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      toast.error("Không thể tải danh sách hàng");
    }
  };

  const fetchCategories = async () => {
    try {
      // 🌟 THAY ĐỔI: Chuyển sang dùng api dùng chung
      const res = await api.get("/categories");
      setCategories(res.data);
      if (res.data.length > 0 && formData.category_id === 0) {
        setFormData((prev) => ({ ...prev, category_id: res.data[0].id }));
      }
    } catch (error) {
      console.error("Lỗi lấy danh mục", error);
      toast.error("Không thể tải danh sách danh mục");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && editId) {
        // 🌟 THAY ĐỔI: Dùng api cập nhật thông tin món
        await api.put(`/products/${editId}`, formData);
        toast.success("Cập nhật thành công ✨");
      } else {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price.toString());
        data.append("category_id", formData.category_id?.toString() || "");
        data.append("quantity", formData.quantity.toString());
        data.append("description", formData.description);
        data.append("roast", formData.roast);
        data.append("weight", formData.weight);

        if (file) {
          data.append("image", file);
        }

        // 🌟 THAY ĐỔI: Dùng api đẩy Multipart Form data lên máy chủ Quarkus
        await api.post("/products/upload", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Thêm món mới thành công ☕");
      }

      resetForm();
      fetchProducts();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Lỗi thao tác!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category_id: categories.length > 0 ? categories[0].id : 0,
      price: 0,
      quantity: 0,
      image_url: "",
      description: "",
      roast: "Medium",
      weight: "",
    });
    setFile(null);
    setIsEditing(false);
    setEditId(null);
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa món này?")) {
      try {
        // 🌟 THAY ĐỔI: Dùng api gửi lệnh xóa sản phẩm
        await api.delete(`/products/${id}`);
        toast.success("Đã xóa xong!");
        fetchProducts();
      } catch (error) {
        toast.error("Không thể xóa món này.");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-amber-900">
            📦 Quản lý Sản Phẩm
          </h1>
          <p className="text-gray-500 italic text-sm text-right">
            Dành cho quản trị viên Cafe Shop
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg mb-10 border border-amber-100"
        >
          <h2 className="text-lg font-bold text-amber-800 mb-6 border-b pb-2">
            {isEditing ? "📝 Chỉnh sửa thông tin" : "➕ Nhập hàng mới"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              placeholder="Tên sản phẩm"
              className="border-2 border-gray-100 p-3 rounded-xl focus:border-amber-500 outline-none transition"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <input
              type="number"
              placeholder="Giá bán (VNĐ)"
              className="border-2 border-gray-100 p-3 rounded-xl focus:border-amber-500 outline-none"
              value={formData.price || ""}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              required
            />

            <input
              type="number"
              placeholder="Số lượng nhập"
              className="border-2 border-gray-100 p-3 rounded-xl focus:border-amber-500 outline-none"
              value={formData.quantity || ""}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
              required
            />

            <select
              className="border-2 border-gray-100 p-3 rounded-xl focus:border-amber-500 outline-none bg-white"
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

            <input
              placeholder="Mức độ rang (VD: Medium, Dark)"
              className="border-2 border-gray-100 p-3 rounded-xl focus:border-amber-500 outline-none"
              value={formData.roast}
              onChange={(e) =>
                setFormData({ ...formData, roast: e.target.value })
              }
            />

            <input
              placeholder="Khối lượng (VD: 250g, 500ml)"
              className="border-2 border-gray-100 p-3 rounded-xl focus:border-amber-500 outline-none"
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: e.target.value })
              }
            />

            <div className="flex flex-col gap-1 lg:col-span-2">
              <label className="text-[10px] text-amber-700 font-bold ml-2 uppercase">
                Ảnh minh họa
              </label>
              <input
                type="file"
                accept="image/*"
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
            </div>

            <textarea
              placeholder="Mô tả hương vị sản phẩm..."
              className="border-2 border-gray-100 p-3 rounded-xl focus:border-amber-500 outline-none lg:col-span-4 h-24"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <button
              type="submit"
              disabled={loading}
              className={`lg:col-span-4 py-4 rounded-xl font-bold text-white shadow-md transition-all active:scale-95 ${isEditing ? "bg-blue-600 hover:bg-blue-700" : "bg-amber-700 hover:bg-amber-800"} disabled:bg-gray-400`}
            >
              {loading
                ? "Đang xử lý..."
                : isEditing
                  ? "CẬP NHẬT THÔNG TIN"
                  : "XÁC NHẬN NHẬP KHO"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="lg:col-span-4 text-gray-400 text-xs hover:text-red-500 transition-colors uppercase font-bold tracking-widest"
              >
                — Hủy bỏ chỉnh sửa —
              </button>
            )}
          </div>
        </form>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-amber-700 text-white">
              <tr>
                <th className="p-4 uppercase text-[10px] font-bold">
                  Hình ảnh
                </th>
                <th className="p-4 uppercase text-[10px] font-bold">Tên món</th>
                <th className="p-4 uppercase text-[10px] font-bold">Đơn giá</th>
                <th className="p-4 uppercase text-[10px] font-bold">Tồn kho</th>
                <th className="p-4 uppercase text-[10px] font-bold text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-amber-50 transition-colors">
                  <td className="p-4">
                    <img
                      src={
                        p.image_url
                          ? p.image_url.startsWith("http")
                            ? p.image_url
                            : `http://localhost:8081/uploads/${p.image_url}`
                          : "https://via.placeholder.com/50"
                      }
                      className="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-200"
                      alt={p.name}
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{p.name}</div>
                    <div className="text-[10px] text-gray-400 uppercase">
                      <span className="font-bold text-amber-600">
                        {p.category_name}
                      </span>
                      {p.roast && p.weight ? ` | ${p.roast} - ${p.weight}` : ""}
                    </div>
                  </td>
                  <td className="p-4 text-amber-700 font-bold">
                    {Number(p.price).toLocaleString()}đ
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-black ${p.quantity < 5 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                    >
                      {p.quantity || 0} MÓN
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditId(p.id!);
                          setFormData(p);
                        }}
                        className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(p.id!)}
                        className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-600 hover:text-white transition"
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

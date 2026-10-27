import { NavLink } from "react-router-dom";
import clsx from "clsx";

const menu = [
  { path: "/", label: "Trang chủ" },
  { path: "/hangtonkho", label: "Quản lý sản phẩm" },
  { path: "/menu", label: "Menu" },
  { path: "/hoadon", label: "Hóa đơn" },
  { path: "/guest", label: "Khách hàng" },
  { path: "/category", label: "Danh mục sản phẩm" },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-gray-300 p-5 flex flex-col">
      <h1 className="text-xl font-bold text-white mb-6">Admin</h1>
      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "px-4 py-2 rounded-lg transition",
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 hover:text-white",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

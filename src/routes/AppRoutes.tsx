import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { SignIn } from "../pages/auth/SignIn";
import { SignUp } from "../pages/auth/SignUp";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import { Inventory } from "../pages/hangtonkho/Inventory";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { MenuProducts } from "../pages/menuproducts/MenuProducts";
import { Invoices } from "../pages/hoadon/Invoices";
import { Category } from "../pages/category/Category";
import { User } from "../pages/guest/User";

export default function AppRoutes() {
  // 🌟 DÒNG KIỂM TRA THẦN THÁNH: Ép hệ thống hiển thị xem thằng nào đang bị rỗng (undefined)
  console.log("=== DANH SÁCH KIỂM TRA SỰ CỐ ===");
  console.log("AdminLayout:", AdminLayout);
  console.log("ProtectedRoute:", ProtectedRoute);
  console.log("PublicRoute:", PublicRoute);
  console.log("Dashboard:", Dashboard);
  console.log("Inventory:", Inventory);
  console.log("Invoices:", Invoices);
  console.log("MenuProducts:", MenuProducts);
  console.log("Category:", Category);
  console.log("=================================");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/hangtonkho"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Inventory />
              </AdminLayout>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <MenuProducts />
              </AdminLayout>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/hoadon"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Invoices />
              </AdminLayout>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/guest"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <User />
              </AdminLayout>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Category />
              </AdminLayout>
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = useAuthStore();

  // 🌟 ĐÃ VÁ LỖI LOOP: Phải kiểm tra đúng quyền ADMIN thì mới tự động chuyển vào Dashboard
  // Nếu là tài khoản thường (USER) kẹt trong máy tính, cứ để họ ở lại trang SignIn!
  if (user && token && user.role === "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

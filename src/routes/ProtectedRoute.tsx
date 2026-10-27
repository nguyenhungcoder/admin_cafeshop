import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = useAuthStore();

  // 🌟 ĐÃ VÁ: Bắt buộc phải có Token và quyền của tài khoản phải là ADMIN mới cho qua trạm
  if (!token || !user || user.role !== "ADMIN") {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

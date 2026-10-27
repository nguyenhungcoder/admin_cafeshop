import React, { useEffect, useState } from "react";
// 🌟 THAY ĐỔI: Import api thông minh thay cho axios thuần
import { api } from "../../services/auth.api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, ShoppingBag, CreditCard, DollarSign } from "lucide-react";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    todayRevenue: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/chart"),
        ]);
        setStats(statsRes.data);
        setChartData(chartRes.data);
      } catch (error) {
        console.error("Lỗi tải Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard(); // Gọi lần đầu

    // 🌟 THÊM: Tự động tải lại sau mỗi 10 giây để Admin luôn thấy dữ liệu mới nhất
    const interval = setInterval(loadDashboard, 10000);

    return () => clearInterval(interval); // Dọn dẹp khi đóng trang
  }, []);

  const statCards = [
    {
      label: "Số lượng khách hàng",
      value: stats.totalCustomers,
      color: "from-teal-500 to-teal-600",
      icon: <Users size={24} />,
    },
    {
      label: "Thu nhập hôm nay",
      value: `${Number(stats.todayRevenue).toLocaleString()}đ`,
      color: "from-emerald-600 to-emerald-700",
      icon: <DollarSign size={24} />,
    },
    {
      label: "Tổng thu nhập",
      value: `${Number(stats.totalRevenue).toLocaleString()}đ`,
      color: "from-teal-700 to-teal-800",
      icon: <CreditCard size={24} />,
    },
    {
      label: "Số đơn hàng",
      value: stats.totalOrders,
      color: "from-cyan-800 to-cyan-900",
      icon: <ShoppingBag size={24} />,
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
        <p className="text-gray-500 text-sm">
          Chào mừng bạn trở lại, chúc một ngày bán hàng tốt lành!
        </p>
      </header>

      {/* 4 Ô Thống Kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {statCards.map((item, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${item.color} text-white p-6 rounded-3xl shadow-lg transform transition hover:scale-105`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg">{item.icon}</div>
            </div>
            <p className="text-sm opacity-80 mb-1 font-medium">{item.label}</p>
            <h3 className="text-2xl font-bold">
              {loading ? "..." : item.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Biểu đồ Doanh thu */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Xu hướng doanh thu
            </h3>
            <p className="text-gray-400 text-xs">Thống kê 7 ngày gần nhất</p>
          </div>
        </div>

        <div className="h-[350px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value) => [
                    `${Number(value).toLocaleString()}đ`,
                    "Doanh thu",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0d9488"
                  strokeWidth={4}
                  fill="url(#colorRev)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 italic">
              Đang tải dữ liệu biểu đồ hoặc chưa có dữ liệu giao dịch...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  Package,
  Clock,
} from "lucide-react";
import API from "../../utils/api";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}
      >
        <Icon size={24} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Monthly
      </span>
    </div>
    <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold font-display mt-1">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: ordersData } = await API.get("/orders");
        const { data: productsData } = await API.get("/products");

        const totalSales = ordersData.orders
          .filter((o) => o.paymentStatus === "paid")
          .reduce((acc, o) => acc + o.totalAmount, 0);

        setStats({
          totalSales,
          totalOrders: ordersData.orders.length,
          totalCustomers: new Set(ordersData.orders.map((o) => o.user._id))
            .size,
          totalProducts: productsData.products.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, [token]);

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-display">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Total Revenue"
          value={`MK ${stats.totalSales.toLocaleString()}`}
          icon={CreditCard}
          color="bg-primary text-primary"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="bg-blue-500 text-blue-500"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="bg-green-500 text-green-500"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="bg-purple-500 text-purple-500"
        />
      </div>

      {/* Recent Activity (Placeholder for now) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-border p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold font-display">Sales Per Day</h2>
            <select className="bg-muted px-4 py-2 rounded-xl text-xs font-semibold focus:outline-none">
              <span className="bg-white">Last 7 Days</span>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-3xl">
            <TrendingUp
              size={48}
              className="text-muted-foreground opacity-20"
            />
            <p className="text-muted-foreground text-sm ml-4 font-medium italic">
              Analytics visualization platform integration here
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-border p-8">
          <h2 className="text-xl font-bold font-display mb-8">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  <Package size={18} />
                </div>
                <span className="font-semibold text-sm">Add New Product</span>
              </div>
              <Clock
                size={16}
                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  <ShoppingBag size={18} />
                </div>
                <span className="font-semibold text-sm">Review Orders</span>
              </div>
              <Clock
                size={16}
                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

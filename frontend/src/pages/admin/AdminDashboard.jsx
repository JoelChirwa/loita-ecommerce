import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  Package,
  Clock,
  ArrowRight,
} from "lucide-react";
import API from "../../utils/api";
import { useAuthStore } from "../../store/authStore";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between mb-4">
      <div
        className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}
      >
        <Icon size={24} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
        Standard
      </span>
    </div>
    <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
    <p className="text-2xl md:text-3xl font-bold font-display mt-1">{value}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          API.get("/orders"),
          API.get("/products"),
        ]);

        const ordersData = ordersRes.data;
        const productsData = productsRes.data;

        const totalSales = (ordersData.orders || [])
          .filter((o) => o.paymentStatus === "paid")
          .reduce((acc, o) => acc + o.totalAmount, 0);

        setStats({
          totalSales,
          totalOrders: (ordersData.orders || []).length,
          totalCustomers: new Set(
            (ordersData.orders || []).map((o) => o.user?._id),
          ).size,
          totalProducts: (productsData.products || []).length,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

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
          index={0}
          title="Total Revenue"
          value={`MK ${stats.totalSales.toLocaleString()}`}
          icon={CreditCard}
          color="bg-primary text-primary"
        />
        <StatCard
          index={1}
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="bg-blue-500 text-blue-500"
        />
        <StatCard
          index={2}
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="bg-green-500 text-green-500"
        />
        <StatCard
          index={3}
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="bg-purple-500 text-purple-500"
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-[2.5rem] border border-border p-6 md:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-xl font-bold font-display">Sales Analytics</h2>
            <select className="bg-muted px-4 py-2 rounded-xl text-xs font-semibold focus:outline-none w-max">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-3xl bg-muted/10 p-4 text-center">
            <TrendingUp
              size={48}
              className="text-muted-foreground opacity-20 mb-4"
            />
            <p className="text-muted-foreground text-sm font-medium italic">
              Detailed sales visualization and trends will appear here
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[2.5rem] border border-border p-6 md:p-8 flex flex-col"
        >
          <h2 className="text-xl font-bold font-display mb-8">Quick Actions</h2>
          <div className="space-y-4 flex-grow">
            {[
              {
                label: "Add New Product",
                icon: Package,
                link: "/admin/products",
              },
              {
                label: "Review All Orders",
                icon: ShoppingBag,
                link: "/admin/orders",
              },
              {
                label: "Manage Customers",
                icon: Users,
                link: "/admin/customers",
              },
            ].map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/50 hover:bg-primary/10 hover:border-primary/20 border border-transparent transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                    <action.icon size={18} />
                  </div>
                  <span className="font-semibold text-sm">{action.label}</span>
                </div>
                <ArrowRight
                  size={16}
                  className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                />
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <Clock size={16} className="text-primary" />
              <p className="text-xs text-muted-foreground">
                Last updated:{" "}
                <span className="font-bold text-foreground">Just now</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

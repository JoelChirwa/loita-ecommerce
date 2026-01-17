import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  LogOut,
  User as UserIcon,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Products", icon: Package, path: "/admin/products" },
    { name: "Orders", icon: ShoppingBag, path: "/admin/orders" },
    { name: "Customers", icon: Users, path: "/admin/customers" },
    { name: "Reviews", icon: MessageSquare, path: "/admin/reviews" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const SidebarContent = () => (
    <>
      <div className="p-8 border-b border-border flex items-center justify-between md:block">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold font-display tracking-tight">
            LOITA <span className="text-primary">ADMIN</span>
          </span>
        </Link>
        <button
          className="md:hidden p-2 hover:bg-muted rounded-xl transition-colors"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      <nav className="p-4 flex-grow space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              location.pathname === item.path
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon size={20} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Link
          to="/profile"
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <UserIcon size={20} />
          Profile ({user?.name?.split(" ")[0] || "Admin"})
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>

        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all pt-2 border-t border-border mt-2"
          target="_blank"
        >
          <ArrowLeft size={20} />
          Back to Shop
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-border p-4 flex items-center justify-between sticky top-0 z-[60]">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold font-display tracking-tight">
            LOITA <span className="text-primary">ADMIN</span>
          </span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-muted rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-white border-r border-border h-screen sticky top-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-[80] md:hidden flex flex-col shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;

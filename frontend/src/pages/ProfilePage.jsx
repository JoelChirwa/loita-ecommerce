import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useAuthStore } from "../store/authStore";
import {
  User as UserIcon,
  ShoppingBag,
  Settings,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await API.get("/orders/my-orders");
        setOrders(data.orders);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders");
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [token]);

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-xl shadow-black/5 text-center">
              <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <UserIcon size={40} />
              </div>
              <h2 className="text-2xl font-bold font-display">{user.name}</h2>
              <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Active Customer
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-border space-y-6">
              <h3 className="font-bold flex items-center gap-2">
                <Settings size={18} className="text-primary" /> Contact Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-muted-foreground" />
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-muted-foreground" />
                  <span className="font-medium">{user.phone}</span>
                </div>
              </div>
              <button className="w-full py-3 rounded-2xl bg-muted font-bold text-xs uppercase tracking-widest hover:bg-muted/80 transition-all">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-10">
              <h1 className="text-3xl font-bold font-display">My Orders</h1>
              <p className="text-muted-foreground">
                Track your beauty haul and delivery status.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={order._id}
                    className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-border group hover:border-primary/20 transition-all shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-muted rounded-2xl">
                          <ShoppingBag size={24} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Order ID
                          </p>
                          <h4 className="font-bold">
                            #{order._id.slice(-8).toUpperCase()}
                          </h4>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {order.paymentStatus === "paid" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {order.paymentStatus}
                        </span>
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${order.orderStatus === "delivered" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}
                        >
                          <Clock size={12} />
                          {order.orderStatus.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-border pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex -space-x-3 overflow-hidden">
                        {order.products.slice(0, 3).map((p, i) => (
                          <div
                            key={i}
                            className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-muted overflow-hidden"
                          >
                            <img
                              src={p.product?.images?.[0]?.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {order.products.length > 3 && (
                          <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-muted flex items-center justify-center text-[10px] font-bold">
                            +{order.products.length - 3}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest text-right">
                          Total Amount
                        </p>
                        <p className="text-2xl font-bold font-display text-primary">
                          MK {order.totalAmount.toLocaleString()}
                        </p>
                        {order.orderStatus === "delivered" && (
                          <Link
                            to={`/product/${order.products[0]?.product?._id}`}
                            className="mt-2 text-xs font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            Rate Products <ChevronRight size={12} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-border">
                <p className="text-muted-foreground">
                  You haven't placed any orders yet.
                </p>
                <Link
                  to="/products"
                  className="text-primary font-bold hover:underline mt-2 inline-block"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  User as UserIcon,
} from "lucide-react";
import API from "../../utils/api";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleMarkDelivered = async (id) => {
    try {
      await API.put(`/orders/${id}/deliver`, {});
      toast.success("Order marked as delivered");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "delivered":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-display">Order Management</h1>
        <p className="text-muted-foreground">
          Track payments and manage delivery status.
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="relative w-full max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Filter by Customer or ID..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <th className="px-8 py-4">Order Details</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Payment</th>
                <th className="px-8 py-4">Fulfillment</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="group hover:bg-muted/20 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {order.user?.name}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone size={10} /> {order.user?.phone || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-sm">
                    MK {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 w-max ${getStatusBg(order.paymentStatus)}`}
                    >
                      {order.paymentStatus === "paid" ? (
                        <CheckCircle2 size={10} />
                      ) : (
                        <Clock size={10} />
                      )}
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 w-max ${getStatusBg(order.orderStatus)}`}
                    >
                      {order.orderStatus === "delivered" ? (
                        <CheckCircle2 size={10} />
                      ) : (
                        <Truck size={10} />
                      )}
                      {order.orderStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {order.orderStatus !== "delivered" &&
                      order.paymentStatus === "paid" && (
                        <button
                          onClick={() => handleMarkDelivered(order._id)}
                          className="text-xs font-bold text-primary hover:underline flex items-center justify-end gap-1 ml-auto"
                        >
                          Mark Delivered <ExternalLink size={12} />
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;

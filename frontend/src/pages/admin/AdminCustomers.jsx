import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Search, Mail, Phone, Calendar, User } from "lucide-react";
import API from "../../utils/api";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuthStore();

  const fetchCustomers = async () => {
    try {
      // We need to implement this endpoint on the backend
      const { data } = await API.get("/auth/users");
      setCustomers(data.users);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch customers");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold font-display">Customers</h1>
          <p className="text-muted-foreground">
            View and manage your registered customers.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-muted/30 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <th className="px-4 md:px-8 py-4">Customer</th>
                <th className="px-4 md:px-8 py-4">Contact Info</th>
                <th className="px-4 md:px-8 py-4">Joined Date</th>
                <th className="px-4 md:px-8 py-4">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-8 py-10 text-center text-muted-foreground"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr
                    key={c._id}
                    className="group hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-4 md:px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs md:text-sm">
                            {c.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground capitalize">
                            {c.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] md:text-xs">
                          <Mail size={12} className="text-muted-foreground" />
                          {c.email}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] md:text-xs">
                          <Phone size={12} className="text-muted-foreground" />
                          {c.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-5 text-[10px] md:text-sm text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-5">
                      <span className="text-[10px] font-semibold px-2 py-1 bg-muted rounded-md text-muted-foreground">
                        Active Account
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;

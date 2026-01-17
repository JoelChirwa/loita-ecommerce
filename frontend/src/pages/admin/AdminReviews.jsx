import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Search, Star, Trash2, MessageSquare, User } from "lucide-react";
import API from "../../utils/api";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuthStore();

  const fetchReviews = async () => {
    try {
      // Fetch all reviews
      const { data } = await API.get("/reviews/all");
      setReviews(data.reviews);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch reviews");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await API.delete(`/reviews/${id}`);
        toast.success("Review deleted");
        fetchReviews();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const filteredReviews = reviews.filter(
    (r) =>
      r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold font-display">Reviews</h1>
          <p className="text-muted-foreground">
            Monitor and manage product reviews from customers.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <th className="px-8 py-4">Product</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Rating</th>
                <th className="px-8 py-4">Comment</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-8 py-10 text-center text-muted-foreground"
                  >
                    No reviews found.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((r) => (
                  <tr
                    key={r._id}
                    className="group hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold">
                        {r.product?.name || "Deleted Product"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-muted-foreground" />
                        <span className="text-sm">
                          {r.user?.name || "Unknown User"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < r.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm line-clamp-2 max-w-xs">
                        {r.comment}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
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

export default AdminReviews;

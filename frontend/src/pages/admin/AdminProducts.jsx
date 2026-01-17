import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Plus,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  Image as ImageIcon,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import API from "../../utils/api";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { token } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "Fragrance",
    stock: "",
    image: "",
    public_id: "",
  });

  const categories = [
    "Fragrance",
    "Skincare",
    "Makeup",
    "Haircare",
    "Bath & Body",
  ];

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        stock: product.stock,
        image: product.images?.[0]?.url || "",
        public_id: product.images?.[0]?.public_id || "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "Fragrance",
        stock: "",
        image: "",
        public_id: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileFormData = new FormData();
    fileFormData.append("image", file);

    setUploading(true);
    try {
      const { data } = await API.post("/upload", fileFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setFormData({
          ...formData,
          image: data.url,
          public_id: data.public_id,
        });
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: [
          {
            url: formData.image,
            public_id: formData.public_id,
          },
        ],
      };

      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, payload);
        toast.success("Product updated!");
      } else {
        await API.post("/products", payload);
        toast.success("Product added!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        toast.success("Product deleted");
        fetchProducts();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold font-display">Manage Products</h1>
          <p className="text-muted-foreground">
            Add, edit or remove products from your shop.
          </p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={20} /> Add Product
        </button>
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
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <th className="px-8 py-4">Product</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Stock</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="group hover:bg-muted/20 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={p.images?.[0]?.url}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-bold text-sm">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-semibold px-3 py-1 bg-muted rounded-full uppercase tracking-tighter">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-bold text-sm">
                    MK {p.price.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-sm">
                    <span
                      className={`font-bold ${p.stock < 10 ? "text-red-500" : "text-green-600"}`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="p-2 hover:bg-white rounded-lg shadow-sm text-primary transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 hover:bg-white rounded-lg shadow-sm text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl my-8"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-3xl font-bold font-display mb-8">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">
                      Price (MK)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">
                      Stock Level
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">
                    Product Image
                  </label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[2rem] p-8 hover:bg-muted/30 transition-all relative overflow-hidden group">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2
                          className="animate-spin text-primary"
                          size={32}
                        />
                        <p className="text-sm font-semibold">
                          Uploading image...
                        </p>
                      </div>
                    ) : formData.image ? (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-dark px-4 py-2 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2">
                            <Upload size={16} /> Change Image
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileUpload}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center gap-4 cursor-pointer w-full">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Upload size={28} />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-lg">
                            Click to upload image
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG or WEBP (Max 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full btn-primary py-4 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminProducts;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCartStore } from "../store/cartStore";
import { toast } from "sonner";
import {
  Star,
  ShoppingCart,
  ShieldCheck,
  Truck,
  MessageSquare,
  Plus,
  Minus,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`,
        );
        setProduct(data.product);
        setLoading(false);
      } catch (error) {
        toast.error("Product not found");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="section-padding flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!product) return <div>Product not found</div>;

  return (
    <div className="bg-muted/10 min-h-screen">
      <div className="section-padding">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-10">
          <a href="/" className="hover:text-primary transition-colors">
            Home
          </a>
          <ChevronRight size={12} />
          <a href="/products" className="hover:text-primary transition-colors">
            Products
          </a>
          <ChevronRight size={12} />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Images */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-[3rem] overflow-hidden bg-white border border-border shadow-2xl shadow-black/5"
            >
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl overflow-hidden border border-border bg-white cursor-pointer hover:border-primary transition-all"
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">
              Avon Premium {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(product.ratingAverage)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-border fill-border"
                    }
                  />
                ))}
                <span className="ml-2 text-sm font-bold">
                  {product.ratingAverage || 0}
                </span>
              </div>
              <span className="text-xs font-semibold text-muted-foreground border-l border-border pl-6 flex items-center gap-2">
                <MessageSquare size={14} /> {product.ratingCount || 0} Reviews
              </span>
            </div>

            <p className="text-3xl font-bold font-display text-foreground mb-8">
              MK {product.price.toLocaleString()}
            </p>

            <div className="prose prose-sm text-muted-foreground mb-10 leading-relaxed max-w-none">
              <p>{product.description}</p>
            </div>

            {/* Actions */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 bg-white border border-border p-2 rounded-2xl">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:text-primary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold w-6 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:text-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => {
                    addItem({ ...product, qty });
                    toast.success("Added to cart!");
                  }}
                  disabled={product.stock === 0}
                  className="flex-grow btn-primary py-4 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} /> Add to Bag
                </button>
              </div>

              {product.stock > 0 && product.stock < 10 && (
                <p className="text-sm font-bold text-red-500 bg-red-50 p-3 rounded-2xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Only {product.stock} items left in stock!
                </p>
              )}
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Quality Guaranteed",
                  desc: "Secure packaging & genuine products",
                },
                {
                  icon: Truck,
                  title: "Safe Delivery",
                  desc: "Handled with care to your door",
                },
              ].map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-white rounded-3xl border border-border"
                >
                  <b.icon
                    size={20}
                    className="text-primary flex-shrink-0 mt-1"
                  />
                  <div>
                    <h4 className="font-bold text-sm">{b.title}</h4>
                    <p className="text-xs text-muted-foreground">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

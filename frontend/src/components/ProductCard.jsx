import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { toast } from "sonner";

const ProductCard = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="group bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-primary/20">
      <Link
        to={`/product/${product._id}`}
        className="block relative aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold border border-border">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span>{product.ratingAverage || 0}</span>
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-black hover:text-white transition-colors"
          >
            <ShoppingCart size={18} /> Quick Add
          </button>
        </div>
      </Link>

      <div className="p-5">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold font-display">
            MK {product.price?.toLocaleString()}
          </span>
          {product.stock === 0 && (
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

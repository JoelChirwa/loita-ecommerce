import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import API from "../utils/api";
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
  Send,
  User as UserIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const fetchProductData = async () => {
    if (!id || id === "undefined") return;
    try {
      const [{ data: prodData }, { data: revData }] = await Promise.all([
        API.get(`/products/${id}`),
        API.get(`/reviews/${id}`),
      ]);
      setProduct(prodData.product);
      setReviews(revData.reviews || []);
      setLoading(false);
    } catch (error) {
      toast.error("Product not found");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Please enter a comment");

    setSubmittingReview(true);
    try {
      await API.post("/reviews", {
        rating,
        comment,
        productId: id,
      });
      toast.success("Review submitted! Thank you.");
      setComment("");
      setRating(5);
      fetchProductData(); // Refresh to show new review
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading)
    return (
      <div className="section-padding flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!product)
    return (
      <div className="section-padding text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="btn-primary inline-flex">
          Back to Shop
        </Link>
      </div>
    );

  return (
    <div className="bg-muted/10 min-h-screen">
      <div className="section-padding">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-10 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="flex-shrink-0" />
          <Link to="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <ChevronRight size={12} className="flex-shrink-0" />
          <span className="text-foreground truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Images */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-white border border-border shadow-2xl shadow-black/5"
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
            <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">
              Avon Premium {product.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold font-display mb-6 leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(product.ratingAverage || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-border fill-border"
                    }
                  />
                ))}
                <span className="ml-2 text-sm font-bold">
                  {product.ratingAverage?.toFixed(1) || "0.0"}
                </span>
              </div>
              <span className="text-xs font-semibold text-muted-foreground border-l border-border pl-4 md:pl-6 flex items-center gap-2">
                <MessageSquare size={14} /> {reviews.length} Reviews
              </span>
            </div>

            <p className="text-3xl md:text-4xl font-bold font-display text-foreground mb-8">
              MK {product.price.toLocaleString()}
            </p>

            <div className="prose prose-sm text-muted-foreground mb-10 leading-relaxed max-w-none">
              <p>{product.description}</p>
            </div>

            {/* Actions */}
            <div className="space-y-6 mb-12">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center justify-between sm:justify-start gap-4 bg-white border border-border p-2 rounded-2xl">
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
              ].map(
                (b, i) =>
                  b && (
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
                        <p className="text-xs text-muted-foreground">
                          {b.desc}
                        </p>
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 max-w-4xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold font-display">
              Customer Reviews
            </h2>
            <div className="text-sm font-bold text-muted-foreground">
              {reviews.length} total reviews
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Review Form */}
            <div className="md:col-span-5">
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-border shadow-sm sticky top-24">
                <h3 className="text-xl font-bold mb-2">Write a Review</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Share your experience with this product.
                </p>

                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setRating(num)}
                            className="transition-transform active:scale-90"
                          >
                            <Star
                              size={24}
                              className={
                                num <= rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted border-muted"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Comment
                      </label>
                      <textarea
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like or dislike?"
                        className="w-full px-4 py-3 rounded-2xl bg-muted/50 border border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all text-sm resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full btn-primary py-3.5 group"
                    >
                      {submittingReview ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Submit Review{" "}
                          <Send
                            size={16}
                            className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                          />
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-muted-foreground px-4">
                      Note: You can only review products that have been
                      delivered to you.
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-6 bg-muted/30 rounded-2xl border border-dashed border-border">
                    <p className="text-sm text-muted-foreground mb-4">
                      Login to write a review
                    </p>
                    <Link
                      to="/login"
                      className="text-primary font-bold hover:underline"
                    >
                      Sign In Now
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Review List */}
            <div className="md:col-span-7 space-y-6">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <motion.div
                    key={rev._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white rounded-3xl border border-border shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">
                          {rev.name || "Customer"}
                        </h4>
                        <div className="flex gap-0.5 text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < rev.rating ? "currentColor" : "none"}
                              className={
                                i < rev.rating
                                  ? "text-yellow-400"
                                  : "text-muted-foreground/20"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-[10px] font-medium text-muted-foreground">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-[3rem] border border-dashed border-border">
                  <MessageSquare
                    size={32}
                    className="mx-auto text-muted-foreground/30 mb-4"
                  />
                  <p className="text-muted-foreground italic font-medium">
                    No reviews yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

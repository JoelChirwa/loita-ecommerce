import React from "react";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const CartPage = () => {
  const { cartItems, removeItem, updateQty, clearCart, getTotal } =
    useCartStore();
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to checkout");
      return navigate("/login");
    }

    try {
      const orderData = {
        orderItems: cartItems,
        totalAmount: getTotal(),
        deliveryNotes: "",
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        // Redirect to PayChangu Checkout
        window.location.href = data.payment_url;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="section-padding flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-bold font-display mb-4">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Looks like you haven't added anything to your cart yet. Explore our
          products and find something beautiful.
        </p>
        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="section-padding">
        <h1 className="text-4xl font-bold font-display mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white p-6 rounded-3xl border border-border flex flex-col sm:flex-row items-center gap-6 group hover:border-primary/20 transition-all"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow">
                  <p className="text-xs font-bold text-primary uppercase tracking-tight mb-1">
                    {item.category}
                  </p>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="font-bold font-display text-primary mt-1">
                    MK {item.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-2xl">
                  <button
                    onClick={() =>
                      updateQty(item._id, Math.max(1, item.qty - 1))
                    }
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-primary transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold w-4 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item._id, item.qty + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-primary transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-bold text-lg font-display">
                    MK {(item.price * item.qty).toLocaleString()}
                  </p>
                  <button
                    onClick={() => {
                      removeItem(item._id);
                      toast.info("Item removed from cart");
                    }}
                    className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-medium transition-colors mt-4"
            >
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] border border-border sticky top-28 shadow-xl shadow-black/5">
              <h2 className="text-2xl font-bold font-display mb-8">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">
                    MK {getTotal().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-primary font-medium text-xs bg-primary/10 px-2 py-1 rounded">
                    Offline arrangement
                  </span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-end">
                  <span className="font-bold text-lg">Total</span>
                  <div className="text-right">
                    <p className="text-3xl font-bold font-display text-primary leading-none">
                      MK {getTotal().toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                      Taxes included
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary py-4 text-lg"
                >
                  Proceed to Payment
                </button>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <img
                    src="https://static.cdnlogo.com/logos/v/22/visa.svg"
                    alt="Visa"
                    className="h-4 opacity-50"
                  />
                  <img
                    src="https://static.cdnlogo.com/logos/m/17/mastercard.svg"
                    alt="Mastercard"
                    className="h-6 opacity-50"
                  />
                  <span className="font-bold">PayChangu</span>
                </div>
              </div>

              <p className="mt-8 text-xs text-center text-muted-foreground leading-relaxed">
                After payment, our team will contact you via your registered
                phone number to arrange the most convenient delivery mode.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Clock, Phone, ArrowRight, Package } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { motion } from "framer-motion";

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const { token } = useAuthStore();
  const { clearCart } = useCartStore();

  useEffect(() => {
    const vRef = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/${id}/verify`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (data.success) {
          setSuccess(true);
          clearCart();
        }
      } catch (error) {
        console.error("Verification failed", error);
      } finally {
        setLoading(false);
      }
    };

    vRef();
  }, [id, token, clearCart]);

  if (loading)
    return (
      <div className="section-padding flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold font-display">
          Verifying Payment...
        </h2>
        <p className="text-muted-foreground mt-2">
          Please do not close this window.
        </p>
      </div>
    );

  return (
    <div className="section-padding flex flex-col items-center justify-center min-h-[70vh] text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${success ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
      >
        {success ? <CheckCircle2 size={48} /> : <Clock size={48} />}
      </motion.div>

      <h1 className="text-4xl font-bold font-display mb-4">
        {success ? "Payment Successful!" : "Order Placed!"}
      </h1>
      <p className="text-lg text-muted-foreground max-w-lg mb-12">
        {success
          ? "Thank you for your purchase. We've received your payment and are processing your order."
          : "We're waiting for payment confirmation. If you've already paid, your status will update shortly."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mb-12">
        <div className="bg-white p-8 rounded-[2rem] border border-border flex flex-col items-center">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl mb-4 text-center">
            <Phone size={24} />
          </div>
          <h3 className="font-bold mb-2">Wait for our Call</h3>
          <p className="text-sm text-muted-foreground">
            Our team will contact you within 24 hours to agree on the best
            delivery mode for your location.
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-border flex flex-col items-center">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl mb-4">
            <Package size={24} />
          </div>
          <h3 className="font-bold mb-2">Track Order</h3>
          <p className="text-sm text-muted-foreground">
            You can monitor your order status in your profile dashboard at any
            time.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/products" className="btn-primary">
          Continue Shopping <ArrowRight size={20} />
        </Link>
        <Link
          to="/profile"
          className="px-8 py-3 rounded-full font-semibold border-2 border-border hover:bg-muted transition-all"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const categories = [
    {
      name: "Fragrance",
      image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=500",
      count: "120+ Products",
    },
    {
      name: "Skincare",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=500",
      count: "80+ Products",
    },
    {
      name: "Makeup",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=500",
      count: "150+ Products",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=1920"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        </div>

        <div className="section-padding relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-[1.1] mb-6">
              Reveal Your <br />
              <span className="text-primary italic">Natural Beauty</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Discover the latest in Avon beauty. From iconic fragrances to
              revolutionary skincare, find everything you need to feel your
              best.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary">
                Shop Collection <ArrowRight size={20} />
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-full font-semibold border-2 border-white/50 text-white hover:bg-white hover:text-black transition-all"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: "Authentic Products",
              desc: "100% Genuine Avon items",
            },
            {
              icon: CreditCard,
              title: "Mobile Money",
              desc: "Secure PayChangu payments",
            },
            {
              icon: Truck,
              title: "Flexible Delivery",
              desc: "Arranged to your preference",
            },
            { icon: Star, title: "Top Rated", desc: "Loved by our community" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="p-3 rounded-2xl bg-white shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <f.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-display">
              Shop by Category
            </h2>
            <p className="text-muted-foreground mt-2">
              Find exactly what you're looking for
            </p>
          </div>
          <Link
            to="/products"
            className="text-primary font-semibold flex items-center gap-2 hover:underline"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-sm font-medium text-white/60 mb-1">
                  {cat.count}
                </p>
                <h3 className="text-2xl font-bold">{cat.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding mb-16">
        <div className="bg-secondary rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-center text-white">
          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Join the Loita Beauty Community
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Create an account today to track your orders, save your favorite
              products, and be the first to know about new arrivals.
            </p>
            <Link to="/register" className="btn-primary">
              Register Now
            </Link>
          </div>
          {/* Decorative gradients */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

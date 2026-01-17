import React from "react";
import Header from "../components/Header";
import { Toaster } from "sonner";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isAdminPath && <Header />}
      <main className="flex-grow">{children}</main>
      {!isAdminPath && (
        <footer className="bg-secondary text-secondary-foreground py-12 px-4 md:px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-bold font-display mb-6">
                LOITA <span className="text-primary">AVON</span>
              </h2>
              <p className="text-secondary-foreground/60 max-w-md">
                Bringing you the finest Avon beauty products. Experience
                quality, elegance, and confidence with our curated collections.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Shop</h3>
              <ul className="space-y-2 text-secondary-foreground/60">
                <li>
                  <a
                    href="/products"
                    className="hover:text-primary transition-colors"
                  >
                    All Products
                  </a>
                </li>
                <li>
                  <a
                    href="/products?category=fragrance"
                    className="hover:text-primary transition-colors"
                  >
                    Fragrances
                  </a>
                </li>
                <li>
                  <a
                    href="/products?category=skincare"
                    className="hover:text-primary transition-colors"
                  >
                    Skincare
                  </a>
                </li>
                <li>
                  <a
                    href="/products?category=makeup"
                    className="hover:text-primary transition-colors"
                  >
                    Makeup
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-secondary-foreground/60">
                <li>
                  <a
                    href="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="hover:text-primary transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-sm text-secondary-foreground/40">
            <p>
              © {new Date().getFullYear()} Loita Avon Shop. All rights reserved.
            </p>
          </div>
        </footer>
      )}
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
};

export default MainLayout;

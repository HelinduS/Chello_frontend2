"use client";

import { useEffect, useState } from "react";

// ✅ Product type (reuse same structure)
type Product = {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  details: string;
  nutrition: string;
  rating: number;
};

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Load from localStorage on page load
  useEffect(() => {
    const stored: Product[] = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(stored);
  }, []);

  const removeFromWishlist = (id: number) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-cyan-800">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-cyan-700 font-medium">{item.price}</p>
                <p className="text-sm text-gray-500 mt-1">
                  ⭐ {item.rating} rating
                </p>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

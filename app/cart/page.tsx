"use client";

import { useCart } from "@/context/cartContext";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center p-4 border rounded-lg bg-white shadow-sm"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-500">
                    Rs. {item.price} × {item.quantity}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-xl font-bold text-green-600">
              Rs. {total.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="destructive"
              onClick={clearCart}
              className="text-white"
            >
              Clear Cart
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

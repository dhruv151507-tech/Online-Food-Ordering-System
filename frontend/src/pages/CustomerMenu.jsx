import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { ShoppingCart, Plus, Minus, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CustomerMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu");
      setMenuItems(res.data);
    } catch (err) {
      console.error("Failed to fetch menu", err);
    } finally {
      setLoading(false);
    }
  };

  const getBackendImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const baseUrl =
      api.defaults?.baseURL?.replace(/\/api$/, "") ||
      import.meta.env.VITE_API_URL;
    return `${baseUrl}${url}`;
  };

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart
        .map((c) => {
          if (c.id === id) {
            return { ...c, quantity: Math.max(0, c.quantity + delta) };
          }
          return c;
        })
        .filter((c) => c.quantity > 0),
    );
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setProcessingOrder(true);

    // Formatting order according to backend expectations
    const orderData = {
      totalPrice: totalPrice,
      status: "Pending",
      items: cart.map((item) => ({
        menuId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      await api.post("/order", orderData);
      setCart([]);
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Failed to place order", err);
      toast.error("Failed to place order.");
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading) return <div className="text-center mt-4">Loading menu...</div>;

  return (
    <div
      className="grid grid-cols-2"
      style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)" }}
    >
      {/* Menu Area */}
      <div>
        <h2>Delicious Menu</h2>
        <div className="grid grid-cols-2">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="card flex flex-col justify-between animate-fade-in"
            >
              <div>
                <img
                  src={
                    getBackendImageUrl(item.imageUrl) ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop"
                  }
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: "1rem",
                  }}
                />
                <h3>{item.name}</h3>
                <span className="badge badge-warning">{item.category}</span>
                {item.description && (
                  <p className="text-sm text-muted mt-2" style={{ margin: 0 }}>
                    {item.description}
                  </p>
                )}
                <p
                  className="mt-2"
                  style={{ fontSize: "1.25rem", fontWeight: "bold" }}
                >
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <button
                className="btn btn-outline mt-3 w-full justify-center"
                onClick={() => addToCart(item)}
              >
                <Plus size={16} /> Add to Order
              </button>
            </div>
          ))}
          {menuItems.length === 0 && (
            <p className="text-muted">No items available.</p>
          )}
        </div>
      </div>

      {/* Cart Area */}
      <div>
        <div className="card" style={{ position: "sticky", top: "100px" }}>
          <h2 className="flex items-center gap-2 border-bottom pb-2">
            <ShoppingCart /> Your Order
          </h2>

          <div className="mt-4 flex flex-col gap-4 max-h-[400px] overflow-auto">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <div>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <div className="text-muted">${item.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-outline"
                    style={{ padding: "0.2rem" }}
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    className="btn btn-outline"
                    style={{ padding: "0.2rem" }}
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <p className="text-muted text-center py-4">
                Your cart is empty. Add some delicious food!
              </p>
            )}
          </div>

          {cart.length > 0 && (
            <div className="mt-4 pt-4 border-top">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-primary w-full justify-center"
                onClick={placeOrder}
                disabled={processingOrder}
                style={{ width: "100%" }}
              >
                <CreditCard size={18} />{" "}
                {processingOrder ? "Processing..." : "Place Order"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerMenu;

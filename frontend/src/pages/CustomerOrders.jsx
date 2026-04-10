import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Package, Clock, CheckCircle, Truck } from "lucide-react";

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order");
      // For now this endpoint returns all orders. Since user endpoint doesn't separate by customer, we will show them all
      // Ideally backend would have /api/order/my-orders
      // We will reverse to show newest first
      setOrders(res.data.reverse());
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="text-warning" />;
      case "preparing":
        return <Package className="text-primary" />;
      case "delivered":
        return <CheckCircle className="text-success" />;
      case "out for delivery":
        return <Truck className="text-primary" />;
      default:
        return <Clock />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "badge-warning";
      case "preparing":
        return "badge-info";
      case "out for delivery":
        return "badge-primary";
      case "delivered":
        return "badge-success";
      default:
        return "badge-secondary";
    }
  };

  if (loading)
    return <div className="text-center mt-4">Loading your orders...</div>;

  return (
    <div
      className="animate-fade-in"
      style={{ maxWidth: "800px", margin: "0 auto" }}
    >
      <h2 className="flex items-center gap-2 mb-4">
        <Package /> My Order History
      </h2>

      {orders.length === 0 ? (
        <div className="card text-center text-muted py-5">
          <Package
            size={48}
            className="mx-auto mb-3"
            style={{ opacity: 0.5 }}
          />
          <h3>No orders yet</h3>
          <p>Go to the menu and place your first order!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="card flex justify-between items-center"
            >
              <div>
                <h4 className="flex items-center gap-2">
                  Order #{order.id}
                  <span
                    className={`badge ${getStatusBadge(order.status)} flex items-center gap-1`}
                  >
                    {getStatusIcon(order.status)} {order.status}
                  </span>
                </h4>
                <div className="text-muted mt-2">
                  {order.items?.length || 0} items ordered
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  ${order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;

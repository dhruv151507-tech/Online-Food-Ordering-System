import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Package, Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order");
      setOrders(res.data.reverse()); // newest first
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/order/${id}/status?status=${newStatus}`);
      toast.success("Status updated");
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Failed to update status");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await api.delete(`/order/${id}`);
      toast.success("Order deleted");
      fetchOrders();
    } catch (err) {
      console.error("Failed to delete order", err);
      toast.error("Failed to delete order");
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

  if (loading) return <div className="text-center mt-4">Loading orders...</div>;

  return (
    <div className="animate-fade-in">
      <h2 className="flex items-center gap-2 mb-4">
        <Package /> Manage Orders
      </h2>

      <div className="card">
        <table
          style={{
            width: "100%",
            textAlign: "left",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)" }}>
              <th className="pb-2">Order ID</th>
              <th className="pb-2">Items Count</th>
              <th className="pb-2">Total Price</th>
              <th className="pb-2">Status</th>
              <th className="pb-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <td className="py-3 font-bold">#{order.id}</td>
                <td className="py-3">{order.items?.length || 0}</td>
                <td className="py-3 text-primary font-bold">
                  ${order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}
                </td>
                <td className="py-3">
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <select
                    className="form-control inline-block w-auto py-1 mr-2"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{ minWidth: "130px" }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button
                    className="btn btn-danger"
                    style={{ padding: "0.3rem 0.5rem" }}
                    onClick={() => deleteOrder(order.id)}
                    title="Delete Order"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="text-center text-muted mt-4">No orders currently.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

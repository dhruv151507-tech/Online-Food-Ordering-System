import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Activity, Clock3, IndianRupee, LayoutDashboard, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import api from '../api/axios';

const chartColors = ['#ff6b35', '#f4a261', '#2a9d8f', '#264653', '#e76f51', '#457b9d'];

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2
});

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short'
});

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    ordersPerDay: [],
    mostOrderedItems: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setStats({
        totalOrders: res.data.totalOrders ?? 0,
        totalRevenue: res.data.totalRevenue ?? 0,
        pendingOrders: res.data.pendingOrders ?? 0,
        ordersPerDay: Array.isArray(res.data.ordersPerDay) ? res.data.ordersPerDay : [],
        mostOrderedItems: Array.isArray(res.data.mostOrderedItems) ? res.data.mostOrderedItems.slice(0, 6) : []
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const ordersPerDay = stats.ordersPerDay.map((entry) => ({
    ...entry,
    label: dateFormatter.format(new Date(entry.date))
  }));

  const mostOrderedItems = stats.mostOrderedItems.map((entry, index) => ({
    ...entry,
    fill: chartColors[index % chartColors.length]
  }));

  if (loading) {
    return <div className="text-center mt-4">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard animate-fade-in">
      <section className="dashboard-hero card">
        <div>
          <p className="dashboard-kicker">Admin Control Center</p>
          <h2 className="dashboard-title">
            <LayoutDashboard size={28} />
            Order Analytics
          </h2>
          <p className="dashboard-subtitle">
            Track order volume, daily activity, and the items customers reorder most.
          </p>
        </div>
        <div className="dashboard-chip">
          <Activity size={18} />
          Live admin snapshot
        </div>
      </section>

      <section className="grid dashboard-stat-grid">
        <article className="card dashboard-stat-card">
          <div className="dashboard-stat-icon stat-orders">
            <ShoppingBag size={28} />
          </div>
          <p className="dashboard-stat-label">Total Orders</p>
          <h3>{stats.totalOrders}</h3>
          <span className="dashboard-stat-note">All orders recorded so far</span>
        </article>

        <article className="card dashboard-stat-card">
          <div className="dashboard-stat-icon stat-revenue">
            <IndianRupee size={28} />
          </div>
          <p className="dashboard-stat-label">Total Revenue</p>
          <h3>{currencyFormatter.format(stats.totalRevenue)}</h3>
          <span className="dashboard-stat-note">Calculated from placed orders</span>
        </article>

        <article className="card dashboard-stat-card">
          <div className="dashboard-stat-icon stat-pending">
            <Clock3 size={28} />
          </div>
          <p className="dashboard-stat-label">Pending Orders</p>
          <h3>{stats.pendingOrders}</h3>
          <span className="dashboard-stat-note">Orders still awaiting completion</span>
        </article>
      </section>

      <section className="dashboard-chart-grid">
        <article className="card dashboard-chart-card">
          <div className="dashboard-section-head">
            <div>
              <p className="dashboard-section-label">Orders Per Day</p>
              <h3>Daily order flow</h3>
            </div>
          </div>
          <div className="dashboard-chart-wrap">
            {ordersPerDay.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ordersPerDay} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#ff6b35" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eadfd7" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="orders" stroke="#ff6b35" strokeWidth={3} fill="url(#ordersGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="dashboard-empty-state">No order history yet.</div>
            )}
          </div>
        </article>

        <article className="card dashboard-chart-card">
          <div className="dashboard-section-head">
            <div>
              <p className="dashboard-section-label">Most Ordered Items</p>
              <h3>Top menu demand</h3>
            </div>
            <UtensilsCrossed size={20} color="#ff6b35" />
          </div>
          <div className="dashboard-chart-wrap">
            {mostOrderedItems.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mostOrderedItems} layout="vertical" margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eadfd7" />
                  <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="item"
                    width={110}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Bar dataKey="quantity" radius={[0, 10, 10, 0]}>
                    {mostOrderedItems.map((entry) => (
                      <Cell key={entry.item} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="dashboard-empty-state">No item analytics yet.</div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminDashboard;

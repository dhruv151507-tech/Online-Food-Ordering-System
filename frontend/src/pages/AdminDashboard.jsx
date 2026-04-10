import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { LayoutDashboard, DollarSign, ShoppingBag, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-4">Loading dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <h2 className="flex items-center gap-2 mb-4">
        <LayoutDashboard /> Admin Dashboard
      </h2>

      <div className="grid grid-cols-3">
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-blue-100 rounded-full" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <ShoppingBag size={32} />
            </div>
          </div>
          <h3 className="text-muted mb-1 font-normal text-lg">Total Orders</h3>
          <p className="text-4xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-green-100 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <DollarSign size={32} />
            </div>
          </div>
          <h3 className="text-muted mb-1 font-normal text-lg">Total Revenue</h3>
          <p className="text-4xl font-bold">${stats.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-yellow-100 rounded-full" style={{ backgroundColor: '#fef9c3', color: '#ca8a04' }}>
              <Clock size={32} />
            </div>
          </div>
          <h3 className="text-muted mb-1 font-normal text-lg">Pending Orders</h3>
          <p className="text-4xl font-bold">{stats.pendingOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

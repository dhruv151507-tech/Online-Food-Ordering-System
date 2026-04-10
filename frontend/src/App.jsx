import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerMenu from './pages/CustomerMenu';
import CustomerOrders from './pages/CustomerOrders';
import AdminDashboard from './pages/AdminDashboard';
import AdminMenu from './pages/AdminMenu';
import AdminOrders from './pages/AdminOrders';
import Navbar from './components/Navbar';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="app-container">
        <Toaster position="top-right" />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to={user ? (user.role === 'ADMIN' ? '/admin/dashboard' : '/menu') : '/login'} />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            
            {/* Customer Routes */}
            <Route path="/menu" element={user ? <CustomerMenu /> : <Navigate to="/login" />} />
            <Route path="/orders" element={user ? <CustomerOrders /> : <Navigate to="/login" />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={user && user.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/admin/menu" element={user && user.role === 'ADMIN' ? <AdminMenu /> : <Navigate to="/" />} />
            <Route path="/admin/orders" element={user && user.role === 'ADMIN' ? <AdminOrders /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

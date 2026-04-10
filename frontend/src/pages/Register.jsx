import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'USER' // default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Request backend to register user
    const response = await register(formData);
    if (response.success) {
      navigate('/login');
    } else {
      setError(response.message || 'Registration failed. Username may be taken.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '80vh' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center flex items-center justify-center gap-2">
          <UserPlus /> Create Account
        </h2>
        <p className="text-center text-muted mb-4">Join us and start ordering delicious food</p>
        
        {error && <div className="badge badge-primary text-center mb-4 p-2">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email (Username)</label>
            <input 
              type="email" 
              className="form-control" 
              value={formData.username} 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              required 
              placeholder="name@example.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
              placeholder="Create a strong password"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select 
              className="form-control" 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="USER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary mt-2" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="text-center mt-4 text-muted">
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

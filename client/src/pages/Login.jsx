import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// Set default base URL for API requests
axios.defaults.baseURL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
    ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
    : `${window.location.origin}/api`;

// Add a response interceptor to handle errors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return Promise.reject({
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status
      });
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({ 
        message: 'No response from server. Please check your connection.' 
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject({ 
        message: error.message || 'An error occurred while setting up the request' 
      });
    }
  }
);

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const { data } = await axios.get('/auth/admin-exists');
        if (mounted) setShowRegister(!data?.exists);
      } catch {
        if (mounted) setShowRegister(false);
      }
    };
    check();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post('/auth/login', {
        email,
        password,
      });
      
      login(data.token, data.user);
      
      // Redirect based on role
      const redirectPath = data.user.role === 'admin' ? '/admin' : '/teacher';
      navigate(redirectPath);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
      
      // Specific error for network issues
      if (err.message && err.message.includes('Network Error')) {
        setError('Cannot connect to the server. Please check your internet connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="cc-section cc-section-centered">
      <div className="cc-auth-panel">
        <h1 className="cc-auth-title-script">Welcome back</h1>
        <p className="cc-auth-subtitle">Sign in to your campus console</p>
        {error && <p className="cc-text-error">{error}</p>}
        <form onSubmit={handleSubmit} className="cc-form">
          <div className="cc-field">
            <label>Email</label>
            <input
              className="cc-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="cc-field">
            <label>Password</label>
            <input
              className="cc-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="cc-btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {showRegister && (
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>New setup?</span>
            <Link to="/register" className="cc-btn-link">Register an admin</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Login;

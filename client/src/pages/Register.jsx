import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/admin-exists');
        if (mounted) {
          if (data?.exists) navigate('/login', { replace: true });
          setChecking(false);
        }
      } catch {
        if (mounted) setChecking(false);
      }
    };
    check();
    return () => { mounted = false; };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const payload = {
        name,
        email,
        password,
        role: 'admin',
      };
      await axios.post('http://localhost:5000/api/auth/register', payload);
      setSuccess('Admin created successfully');
      setFormData({ name: '', email: '', password: '', role: 'admin' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  if (checking) return null;
  return (
    <section className="cc-section cc-section-centered">
      <div className="cc-auth-panel">
        <h1 className="cc-auth-title-script">Create Admin</h1>
        <p className="cc-auth-subtitle">First time setup or add another admin</p>
        {error && <p className="cc-text-error">{error}</p>}
        {success && <p className="cc-text-success">{success}</p>}
        <form onSubmit={handleSubmit} className="cc-form">
          <div className="cc-field">
            <label>Name</label>
            <input
              className="cc-input"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className="cc-field">
            <label>Email</label>
            <input
              className="cc-input"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="cc-field">
            <label>Password</label>
            <input
              className="cc-input"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="cc-btn-primary">Register</button>
        </form>
      </div>
    </section>
  );
};

export default Register;

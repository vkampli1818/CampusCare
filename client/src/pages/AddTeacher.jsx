import React, { useState } from 'react';
import axios from 'axios';

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    phone: '',
    designation: '',
    specifications: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDesignation, setOpenDesignation] = useState(false);

  const { name, email, password, department, phone, designation, specifications } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('Name, email and password are required');
      return;
    }

    try {
      const payload = {
        name,
        email,
        password,
        role: 'teacher',
        department,
        phone,
        designation,
        specifications,
      };
      await axios.post('http://localhost:5000/api/auth/register', payload);
      setSuccess('Teacher created successfully');
      setFormData({ name: '', email: '', password: '', department: '', phone: '', designation: '', specifications: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className="cc-section cc-section-centered">
      <div className="cc-auth-panel">
        <h1 className="cc-auth-title-script">Add Teacher</h1>
        <p className="cc-auth-subtitle">Provision teacher access</p>
        {error && <p className="cc-text-error">{error}</p>}
        {success && <p className="cc-text-success">{success}</p>}
        <form onSubmit={handleSubmit} className="cc-form">
          <div className="cc-field">
            <label>Name</label>
            <input className="cc-input" name="name" value={name} onChange={onChange} required />
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
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Teacher email must end with @campuscare.com</div>
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
          <div className="cc-field">
            <label>Department</label>
            <input
              className="cc-input"
              name="department"
              value={department}
              onChange={onChange}
              placeholder="e.g., CSE, ECE"
            />
          </div>
          <div className="cc-field">
            <label>Phone</label>
            <input className="cc-input" name="phone" value={phone} onChange={onChange} placeholder="e.g., 9876543210" />
          </div>
          <div className="cc-field" style={{ position: 'relative' }}>
            <label>Designation</label>
            <div
              className="cc-input"
              role="button"
              tabIndex={0}
              onClick={() => setOpenDesignation(v => !v)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenDesignation(v => !v); } }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
              <span style={{ opacity: designation ? 1 : 0.7 }}>
                {designation || 'Select designation'}
              </span>
              <span style={{ opacity: 0.7 }}>▾</span>
            </div>
            {openDesignation && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'var(--cc-panel, #0b1220)',
                  color: 'var(--cc-text, #e2e8f0)',
                  border: '1px solid var(--cc-border, #23314f)',
                  borderRadius: 8,
                  marginTop: 6,
                  zIndex: 20,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                }}
              >
                {['Professor','Guest Professor'].map(opt => (
                  <div
                    key={opt}
                    onClick={() => { setFormData({ ...formData, designation: opt }); setOpenDesignation(false); }}
                    style={{ padding: '10px 12px', cursor: 'pointer', background: designation === opt ? 'rgba(59,130,246,0.15)' : 'transparent' }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="cc-field">
            <label>Specifications</label>
            <input className="cc-input" name="specifications" value={specifications} onChange={onChange} placeholder="e.g., AI/ML, Data Science" />
          </div>
          <button type="submit" className="cc-btn-primary">Create</button>
        </form>
      </div>
    </section>
  );
};

export default AddTeacher;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TeacherLeaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ date: '', reason: '' });

  useEffect(() => {
    const loadLeaves = async () => {
      if (!user?.id) return;
      setError('');
      try {
        const { data } = await axios.get(`http://localhost:5000/api/teachers/${user.id}/leaves`);
        setLeaves(data);
      } catch (e) {
        setError('Failed to load leaves');
      }
    };
    loadLeaves();
  }, [user?.id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const submitAppeal = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.date) return setError('Date is required');
    try {
      await axios.post(`http://localhost:5000/api/teachers/${user.id}/leaves`, {
        date: form.date,
        reason: form.reason,
      });
      const { data } = await axios.get(`http://localhost:5000/api/teachers/${user.id}/leaves`);
      setLeaves(data);
      setForm({ date: '', reason: '' });
      setSuccess('Leave appeal submitted');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to submit appeal');
    }
  };

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-dashboard-header">
        <div>
          <h1 className="cc-dashboard-title">My Leaves</h1>
          <p className="cc-dashboard-subtitle">Appeal for leave and track status</p>
        </div>
      </div>

      {error && <p className="cc-text-error" style={{ marginBottom: 12 }}>{error}</p>}
      {success && <p className="cc-text-success" style={{ marginBottom: 12 }}>{success}</p>}

      <div className="cc-card" style={{ marginBottom: 16 }}>
        <form onSubmit={submitAppeal} className="cc-form-grid">
          <div className="cc-form-field">
            <label className="cc-label">Date<span style={{ color: '#f66' }}>*</span></label>
            <input className="cc-input" type="date" name="date" value={form.date} onChange={onChange} required />
          </div>
          <div className="cc-form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="cc-label">Reason</label>
            <input className="cc-input" name="reason" value={form.reason} onChange={onChange} placeholder="Optional" />
          </div>
          <div className="cc-form-actions">
            <button type="submit" className="cc-btn-primary">Submit Appeal</button>
          </div>
        </form>
      </div>

      <div className="cc-card">
        <h3 className="cc-auth-subtitle" style={{ marginBottom: 12 }}>Leaves</h3>
        <table className="cc-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((lv) => (
              <tr key={lv.id}>
                <td>{lv.date ? new Date(lv.date).toLocaleDateString() : ''}</td>
                <td>{lv.reason || '—'}</td>
                <td>{lv.status}</td>
              </tr>
            ))}
            {!leaves.length && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: 'var(--cc-muted)' }}>No leaves yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TeacherLeaves;

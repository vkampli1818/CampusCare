import React, { useEffect, useState } from 'react';
import axios from 'axios';

const empty = { title: '', details: '', date: '', time: '', venue: '' };

const AdminNotices = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setError('');
    try {
      const { data } = await axios.get('http://localhost:5000/api/notices');
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      // Treat as empty if endpoint returns error (e.g., none yet or server just restarted)
      setItems([]);
    }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.title.trim()) return setError('Title is required');
    if (!form.date || !form.time) return setError('Date and Time are required');
    const dateTime = new Date(`${form.date}T${form.time}:00`);
    try {
      if (editId) {
        const { data } = await axios.put(`http://localhost:5000/api/notices/${editId}`, { ...form, dateTime });
        setItems(data); setSuccess('Notice updated'); setEditId(null); setForm(empty);
      } else {
        const { data } = await axios.post('http://localhost:5000/api/notices', { ...form, dateTime });
        setItems(data); setSuccess('Notice created'); setForm(empty);
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Save failed');
    }
  };

  const startEdit = (n) => {
    setEditId(n._id);
    setForm({
      title: n.title || '',
      details: n.details || '',
      venue: n.venue || '',
      date: n.dateTime ? new Date(n.dateTime).toISOString().slice(0,10) : '',
      time: n.dateTime ? new Date(n.dateTime).toISOString().slice(11,16) : '',
    });
  };

  const remove = async (id) => {
    if (!confirm('Delete this notice?')) return;
    setError(''); setSuccess('');
    try {
      const { data } = await axios.delete(`http://localhost:5000/api/notices/${id}`);
      setItems(data); setSuccess('Notice deleted');
      if (editId === id) { setEditId(null); setForm(empty); }
    } catch (e) {
      setError(e?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-dashboard-header">
        <div>
          <h1 className="cc-dashboard-title">Notices (Admin)</h1>
          <p className="cc-dashboard-subtitle">Announce meetings, achievements, events</p>
        </div>
      </div>

      {error && <p className="cc-text-error" style={{ marginBottom: 12 }}>{error}</p>}
      {success && <p className="cc-text-success" style={{ marginBottom: 12 }}>{success}</p>}

      <div className="cc-card" style={{ marginBottom: 16 }}>
        <form onSubmit={submit} className="cc-form-grid">
          <div className="cc-form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="cc-label">Title</label>
            <input className="cc-input" name="title" value={form.title} onChange={onChange} required />
          </div>
          <div className="cc-form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="cc-label">Details</label>
            <input className="cc-input" name="details" value={form.details} onChange={onChange} placeholder="Optional" />
          </div>
          <div className="cc-form-field">
            <label className="cc-label">Date</label>
            <input className="cc-input" type="date" name="date" value={form.date} onChange={onChange} required />
          </div>
          <div className="cc-form-field">
            <label className="cc-label">Time</label>
            <input className="cc-input" type="time" name="time" value={form.time} onChange={onChange} required />
          </div>
          <div className="cc-form-field">
            <label className="cc-label">Venue</label>
            <input className="cc-input" name="venue" value={form.venue} onChange={onChange} placeholder="Optional" />
          </div>
          <div className="cc-form-actions">
            <button type="submit" className="cc-btn-primary">{editId ? 'Update Notice' : 'Add Notice'}</button>
            {editId && <button type="button" className="cc-btn-ghost" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="cc-card">
        <h3 className="cc-auth-subtitle" style={{ marginBottom: 12 }}>All Notices</h3>
        <table className="cc-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date/Time</th>
              <th>Venue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(n => (
              <tr key={n._id}>
                <td>{n.title}</td>
                <td>{n.dateTime ? new Date(n.dateTime).toLocaleString() : ''}</td>
                <td>{n.venue || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="cc-btn-secondary" onClick={() => startEdit(n)}>Edit</button>
                    <button className="cc-btn-danger" onClick={() => remove(n._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr><td colSpan="4" style={{ textAlign:'center', color:'var(--cc-muted)' }}>No notices</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminNotices;

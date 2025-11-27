import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AdminInfrastructure = () => {
  const [details, setDetails] = useState('');
  const [amountRs, setAmountRs] = useState('');
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/infrastructure');
      setItems(data);
    } catch (e) {
      setError('Failed to load infrastructure');
    }
  };

  const startEdit = (it) => {
    setEditingId(it._id);
    setDetails(it.details || '');
    setAmountRs(String(it.amountRs ?? ''));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDetails('');
    setAmountRs('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!details.trim()) return setError('Details are required');
    if (amountRs === '' || isNaN(Number(amountRs))) return setError('Amount (Rs) is required');
    setError('');
    setSuccess('');
    try {
      const { data } = await axios.put(`http://localhost:5000/api/infrastructure/${editingId}`, {
        details: details.trim(),
        amountRs: Number(amountRs),
      });
      setItems((prev) => prev.map((x) => (x._id === editingId ? data : x)));
      setSuccess('Entry updated');
      cancelEdit();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update entry');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this entry?')) return;
    setError('');
    setSuccess('');
    try {
      await axios.delete(`http://localhost:5000/api/infrastructure/${id}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
      setSuccess('Entry deleted');
      if (editingId === id) cancelEdit();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete entry');
    }
  };

  useEffect(() => { load(); }, []);

  const total = useMemo(() => items.reduce((sum, it) => sum + (Number(it.amountRs) || 0), 0), [items]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!details.trim()) return setError('Details are required');
    if (amountRs === '' || isNaN(Number(amountRs))) return setError('Amount (Rs) is required');

    try {
      const { data } = await axios.post('http://localhost:5000/api/infrastructure', {
        details: details.trim(),
        amountRs: Number(amountRs),
      });
      setItems((prev) => [data, ...prev]);
      setDetails('');
      setAmountRs('');
      setSuccess('Entry added');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to add entry');
    }
  };

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-dashboard-header">
        <div>
          <h1 className="cc-dashboard-title">Infrastructure</h1>
          <p className="cc-dashboard-subtitle">Track infrastructure spend</p>
        </div>
      </div>

      {error && <p className="cc-text-error" style={{ marginBottom: 12 }}>{error}</p>}
      {success && <p className="cc-text-success" style={{ marginBottom: 12 }}>{success}</p>}

      <div className="cc-card" style={{ marginBottom: 16 }}>
        <form onSubmit={submit} className="cc-form-grid">
          <div className="cc-form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="cc-label">Details<span style={{ color: '#f66' }}>*</span></label>
            <textarea className="cc-input" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g. New Lab Equipment" required />
          </div>
          <div className="cc-form-field">
            <label className="cc-label">Amount (Rs)<span style={{ color: '#f66' }}>*</span></label>
            <input className="cc-input" type="number" min="0" value={amountRs} onChange={(e) => setAmountRs(e.target.value)} placeholder="e.g. 150000" required />
          </div>
          <div className="cc-form-actions">
            <button type="submit" className="cc-btn-primary">Add Entry</button>
          </div>
        </form>
      </div>

      <div className="cc-card">
        <h3 className="cc-auth-subtitle" style={{ marginBottom: 12 }}>Entries</h3>
        <table className="cc-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Details</th>
              <th>Amount (Rs)</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id}>
                <td>
                  {editingId === it._id ? (
                    <input className="cc-input" value={details} onChange={(e) => setDetails(e.target.value)} />
                  ) : (
                    <span style={{ maxWidth: 520, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.details}</span>
                  )}
                </td>
                <td>
                  {editingId === it._id ? (
                    <input className="cc-input" type="number" min="0" value={amountRs} onChange={(e) => setAmountRs(e.target.value)} />
                  ) : (
                    it.amountRs
                  )}
                </td>
                <td>{new Date(it.createdAt).toLocaleString()}</td>
                <td>
                  {editingId === it._id ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="cc-btn-primary" onClick={saveEdit}>Save</button>
                      <button className="cc-btn-ghost" onClick={cancelEdit}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="cc-btn-secondary" onClick={() => startEdit(it)}>Edit</button>
                      <button className="cc-btn-danger" onClick={() => remove(it._id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--cc-muted)' }}>No entries yet</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ fontWeight: 600 }}>Total</td>
              <td style={{ fontWeight: 600 }}>{total}</td>
              <td colSpan="2" />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};

export default AdminInfrastructure;

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ManageLeaves = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = useMemo(() => user?.role === 'admin', [user]);
  const canEdit = useMemo(() => user?.role === 'teacher', [user]);

  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ date: '', reason: '', status: 'Pending' });

  const loadLeaves = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/students/${id}/leaves`);
      setLeaves(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const addLeave = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.date) {
      setError('Date is required');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/students/${id}/leaves`, form);
      setForm({ date: '', reason: '', status: 'Pending' });
      await loadLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add leave');
    }
  };

  const updateLeave = async (leaveId, patch) => {
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/students/${id}/leaves/${leaveId}`, patch);
      await loadLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update leave');
    }
  };

  const deleteLeave = async (leaveId) => {
    if (!window.confirm('Delete this leave?')) return;
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}/leaves/${leaveId}`);
      await loadLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete leave');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-dashboard-header">
        <div>
          <h1 className="cc-dashboard-title">Leaves</h1>
          <p className="cc-dashboard-subtitle">{canEdit ? 'Manage' : 'View'} student leaves</p>
        </div>
        <button className="cc-btn-ghost" onClick={() => navigate(-1)}>Back</button>
      </div>

      {error && <p className="cc-text-error" style={{ marginBottom: 12 }}>{error}</p>}

      {canEdit && (
        <div className="cc-card cc-form-compact" style={{ marginBottom: 20 }}>
          <h3 className="cc-dashboard-subtitle" style={{ marginBottom: 10 }}>Add Leave</h3>
          <form onSubmit={addLeave} className="cc-form">
            <div className="cc-field">
              <label>Date</label>
              <input
                className="cc-input"
                type="date"
                name="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div className="cc-field">
              <label>Reason</label>
              <input
                className="cc-input"
                name="reason"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="cc-field">
              <label>Status</label>
              <select
                className="cc-select"
                name="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <button type="submit" className="cc-btn-primary">Add Leave</button>
          </form>
        </div>
      )}

      <div className="cc-card">
        <h3 className="cc-dashboard-subtitle" style={{ marginBottom: 12 }}>Leave History</h3>
        <table className="cc-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              {canEdit && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaves.map((lv) => (
              <tr key={String(lv.id)}>
                <td>{new Date(lv.date).toLocaleDateString()}</td>
                <td>{lv.reason || '—'}</td>
                <td>
                  {canEdit ? (
                    <select
                      className="cc-input"
                      value={lv.status}
                      onChange={(e) => updateLeave(lv.id, { status: e.target.value })}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  ) : (
                    <span className="cc-pill">{lv.status}</span>
                  )}
                </td>
                {canEdit && (
                  <td>
                    <button className="cc-btn-secondary" onClick={() => updateLeave(lv.id, { date: lv.date, reason: lv.reason, status: lv.status })}>
                      Save
                    </button>
                    <button className="cc-btn-danger" style={{ marginLeft: 8 }} onClick={() => deleteLeave(lv.id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ManageLeaves;

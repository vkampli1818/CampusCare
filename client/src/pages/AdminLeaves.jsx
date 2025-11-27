import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

// Admin can only set to Approved or Rejected
const statuses = ['Approved', 'Rejected'];

const AdminLeaves = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/teachers');
        setTeachers(data);
        if (data.length) setSelectedId(data[0]._id);
      } catch (e) {
        setError('Failed to load teachers');
      }
    })();
  }, []);

  const selectedTeacher = useMemo(() => teachers.find(t => t._id === selectedId), [teachers, selectedId]);

  useEffect(() => {
    const loadLeaves = async () => {
      if (!selectedId) return;
      setError('');
      try {
        const { data } = await axios.get(`http://localhost:5000/api/teachers/${selectedId}/leaves`);
        setLeaves(data);
      } catch (e) {
        setError('Failed to load leaves');
      }
    };
    loadLeaves();
  }, [selectedId]);

  const updateLeave = async (leaveId, patch) => {
    setError('');
    setSuccess('');
    try {
      const { data } = await axios.put(`http://localhost:5000/api/teachers/${selectedId}/leaves/${leaveId}`, patch);
      setLeaves(data);
      setSuccess('Leave updated');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update leave');
    }
  };

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-dashboard-header">
        <div>
          <h1 className="cc-dashboard-title">Teacher Leaves (Admin)</h1>
          <p className="cc-dashboard-subtitle">View and manage teacher leaves</p>
        </div>
      </div>

      {error && <p className="cc-text-error" style={{ marginBottom: 12 }}>{error}</p>}
      {success && <p className="cc-text-success" style={{ marginBottom: 12 }}>{success}</p>}

      <div className="cc-card" style={{ marginBottom: 16 }}>
        <div className="cc-form-grid">
          <div className="cc-form-field">
            <label className="cc-label">Teacher</label>
            <select className="cc-input" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              {teachers.map(t => (
                <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
              ))}
            </select>
          </div>
          {selectedTeacher && (
            <div className="cc-form-field" style={{ gridColumn: '1 / -1' }}>
              <div className="cc-muted">Department: {selectedTeacher.department || '—'} • Phone: {selectedTeacher.phone || '—'}</div>
            </div>
          )}
        </div>
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
                <td>{lv.date ? new Date(lv.date).toISOString().slice(0,10) : ''}</td>
                <td>{lv.reason || '—'}</td>
                <td>
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="cc-btn-secondary" onClick={() => updateLeave(lv.id, { status: 'Approved' })}>Approve</button>
                    <button className="cc-btn-danger" onClick={() => updateLeave(lv.id, { status: 'Rejected' })}>Reject</button>
                    <span style={{ marginLeft: 8, opacity: 0.85 }}>{lv.status}</span>
                  </div>
                </td>
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

export default AdminLeaves;

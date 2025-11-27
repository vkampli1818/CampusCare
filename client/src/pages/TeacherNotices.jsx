import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeacherNotices = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const { data } = await axios.get('http://localhost:5000/api/notices');
      setItems(data);
    } catch (e) {
      setError('Failed to load notices');
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-dashboard-header">
        <div>
          <h1 className="cc-dashboard-title">Notices</h1>
          <p className="cc-dashboard-subtitle">Announcements from Admin</p>
        </div>
      </div>

      {error && <p className="cc-text-error" style={{ marginBottom: 12 }}>{error}</p>}

      <div className="cc-card">
        <h3 className="cc-auth-subtitle" style={{ marginBottom: 12 }}>All Notices</h3>
        <table className="cc-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date/Time</th>
              <th>Venue</th>
            </tr>
          </thead>
          <tbody>
            {items.map(n => (
              <tr key={n._id}>
                <td>{n.title}</td>
                <td>{n.dateTime ? new Date(n.dateTime).toLocaleString() : ''}</td>
                <td>{n.venue || '—'}</td>
              </tr>
            ))}
            {!items.length && (
              <tr><td colSpan="3" style={{ textAlign:'center', color:'var(--cc-muted)' }}>No notices</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TeacherNotices;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/teachers');
        setTeachers(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load teachers');
      }
    };
    load();
  }, []);

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-dashboard-header">
        <div>
          <h1 className="cc-dashboard-title">Teacher Directory</h1>
          <p className="cc-dashboard-subtitle">Details of all faculty members</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link className="cc-btn-secondary" to="/admin/add-teacher">Add Teacher</Link>
          <button className="cc-btn-ghost" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
      {error && <p className="cc-text-error" style={{ marginBottom: 12 }}>{error}</p>}
      <div className="cc-card">
        <table className="cc-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Specifications</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(t => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.phone || '—'}</td>
                <td>{t.designation || '—'}</td>
                <td>{t.department || '—'}</td>
                <td>{t.specifications || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminTeachers;

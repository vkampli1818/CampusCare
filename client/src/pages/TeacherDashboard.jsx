import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentList from './StudentList';

const TeacherDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/teachers');
        setTeachers(data);
      } catch (err) {
        // Non-fatal for page; silent or minimal feedback
      }
    };
    fetchTeachers();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-dashboard-header">
        <div>
          <h1 className="cc-dashboard-title">Faculty Console</h1>
          <p className="cc-dashboard-subtitle">Your quick access to faculty tools</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="cc-btn-ghost" onClick={() => navigate('/teacher/leaves')}>Leaves</button>
          <button className="cc-btn-ghost" onClick={() => navigate('/teacher/salary')}>Salary</button>
          <button className="cc-btn-ghost" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      {error && <p className="cc-text-error" style={{ marginBottom: 12 }}>{error}</p>}
      <div className="cc-analytics-row">
        <div className="cc-card cc-analytics-card">
          <div className="cc-analytics-label">Teachers</div>
          <div className="cc-analytics-value">{teachers.length}</div>
        </div>
      </div>
      {teachers.length > 0 && (
        <div className="cc-card cc-analytics-card" style={{ marginBottom: 20 }}>
          <div className="cc-analytics-label">Faculty Directory</div>
          <div className="cc-teacher-grid">
            {teachers.map(t => (
              <div key={t._id} className="cc-teacher-card">
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.8, wordBreak: 'break-all' }}>{t.email}</div>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <span className="cc-pill">{t.department || '—'}</span>
                    <span className="cc-pill">{t.designation || '—'}</span>
                  </div>
                </div>
                <div className="cc-teacher-meta">
                  <div>Phone: {t.phone || '—'}</div>
                  <div className="cc-teacher-specs">Specs: {t.specifications || '—'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="cc-card">
        <StudentList isAdmin={false} />
      </div>
    </section>
  );
};

export default TeacherDashboard;

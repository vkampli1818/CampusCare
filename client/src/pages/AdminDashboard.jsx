import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentList from './StudentList';

const AdminDashboard = () => {
  const { logout, ready } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/students');
        setStudents(data);
      } catch (err) {
        setError(err?.message || err?.response?.data?.message || 'Failed to load analytics');
      }
    };

    fetchStudents();
  }, [ready]);

  const paidCount = students.filter(s => s.feeStatus === 'Paid').length;
  const pendingCount = students.filter(s => s.feeStatus === 'Pending').length;
  const notPaidCount = students.filter(s => s.feeStatus === 'Not Paid').length;
  const total = students.length || 1;
  const paidPct = (paidCount / total) * 100;
  const pendingPct = (pendingCount / total) * 100;
  const notPaidPct = (notPaidCount / total) * 100;

  const avgMarks = students.length
    ? students.reduce((sum, s) => sum + (s.marks || 0), 0) / students.length
    : 0;
  const avgCgpa = students.length
    ? students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length
    : 0;

  const divisionA = students.filter(s => (s.division || '') === 'A').length;
  const divisionB = students.filter(s => (s.division || '') === 'B').length;

  const passCount = students.filter(s => (s.marks || 0) >= 40).length;
  const distinctionCount = students.filter(s => (s.marks || 0) >= 75).length;

  const topStudent = students.reduce(
    (best, s) => ((s.marks || 0) > (best?.marks || 0) ? s : best),
    null
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-dashboard-header">
        <div>
          <h1 className="cc-dashboard-title">Admin Suite</h1>
          <p className="cc-dashboard-subtitle">Manage your students with elegance</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="cc-btn-ghost" onClick={() => navigate('/admin/teachers')}>View Teachers</button>
          <button className="cc-btn-ghost" onClick={() => navigate('/admin/events')}>Events</button>
          <button className="cc-btn-ghost" onClick={() => navigate('/admin/library')}>Library</button>
          <button className="cc-btn-ghost" onClick={() => navigate('/admin/infrastructure')}>Infrastructure</button>
          <button className="cc-btn-ghost" onClick={() => navigate('/admin/leaves')}>Leaves</button>
          <button className="cc-btn-ghost" onClick={() => navigate('/admin/salary')}>Salary</button>
          <button className="cc-btn-ghost" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      {error && <p className="cc-text-error" style={{ marginBottom: 12 }}>{error}</p>}
      <div className="cc-analytics-row">
        <div className="cc-card cc-analytics-card">
          <div className="cc-analytics-label">Total Students</div>
          <div className="cc-analytics-value">{students.length}</div>
          <div className="cc-analytics-meta">
            <span>Div A: {divisionA}</span>
            <span>Div B: {divisionB}</span>
          </div>
        </div>
        <div className="cc-card cc-analytics-card">
          <div className="cc-analytics-label">Fee Status</div>
          <div className="cc-analytics-pill-row">
            <span className="cc-pill cc-pill-paid">Paid: {paidCount}</span>
            <span className="cc-pill cc-pill-pending">Pending: {pendingCount}</span>
            <span className="cc-pill cc-pill-notpaid">Not Paid: {notPaidCount}</span>
          </div>
          <div className="cc-bar-chart">
            <div className="cc-bar-track">
              <div
                className="cc-bar-segment cc-bar-paid"
                style={{ width: `${paidPct}%` }}
              />
              <div
                className="cc-bar-segment cc-bar-pending"
                style={{ width: `${pendingPct}%` }}
              />
              <div
                className="cc-bar-segment cc-bar-notpaid"
                style={{ width: `${notPaidPct}%` }}
              />
            </div>
          </div>
        </div>
        {topStudent && (
          <div className="cc-card cc-analytics-card">
            <div className="cc-analytics-label">Top Performer</div>
            <div className="cc-analytics-value" style={{ fontSize: 16 }}>
              {topStudent.name || topStudent.regno}
            </div>
            <div className="cc-analytics-meta">
              <span>Marks: {topStudent.marks}</span>
              <span>CGPA: {topStudent.cgpa}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="cc-card">
        <StudentList isAdmin />
      </div>
    </section>
  );
};

export default AdminDashboard;

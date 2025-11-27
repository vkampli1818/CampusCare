import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TeacherSalary = () => {
  const { user } = useAuth();
  const [salary, setSalary] = useState({ totalSalary: 0, paidSalary: 0, remaining: 0 });
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setError('');
      try {
        const { data } = await axios.get(`http://localhost:5000/api/teachers/${user.id}/salary`);
        setSalary(data);
      } catch (e) {
        setError('Failed to load salary');
      }
    };
    load();
  }, [user?.id]);

  useEffect(() => {
    const loadRecords = async () => {
      if (!user?.id) return;
      try {
        const { data } = await axios.get(`http://localhost:5000/api/teachers/${user.id}/salary-records`);
        setRecords(data);
      } catch (e) {
        // non-blocking
      }
    };
    loadRecords();
  }, [user?.id]);

  const downloadPdf = () => {
    const html = `<!DOCTYPE html>
      <html><head><title>Salary Slip</title>
      <style>
        body{font-family: Arial, sans-serif; padding:20px;}
        h1{font-size:20px;margin:0 0 8px}
        h2{font-size:14px;margin:16px 0 8px}
        table{width:100%;border-collapse:collapse}
        th,td{border:1px solid #ccc;padding:8px;text-align:left}
        th{background:#f3f3f3}
      </style></head>
      <body>
        <h1>Salary Slip</h1>
        <div>Name: ${user?.name || ''}</div>
        <div>Email: ${user?.email || ''}</div>
        <div>Generated: ${new Date().toLocaleString()}</div>
        <h2>Summary</h2>
        <table><tbody>
          <tr><th>Total Salary</th><td>${salary.totalSalary}</td></tr>
          <tr><th>Paid</th><td>${salary.paidSalary}</td></tr>
          <tr><th>Remaining</th><td>${salary.remaining}</td></tr>
        </tbody></table>
        <h2>Monthly Records</h2>
        <table><thead><tr><th>Month</th><th>Total</th><th>Paid</th><th>Status</th></tr></thead>
        <tbody>
          ${records.map(r => `<tr><td>${r.month}</td><td>${r.total}</td><td>${r.paid}</td><td>${r.status}</td></tr>`).join('')}
        </tbody></table>
        <script>window.onload = function(){window.print();}</script>
      </body></html>`;
    const w = window.open('', '_blank');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
    }
  };

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-dashboard-header">
        <div>
          <h1 className="cc-dashboard-title">My Salary</h1>
          <p className="cc-dashboard-subtitle">Read-only overview of your salary</p>
        </div>
      </div>

      {error && <p className="cc-text-error" style={{ marginBottom: 12 }}>{error}</p>}

      <div className="cc-card" style={{ marginBottom: 28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8 }}>
          <h3 className="cc-auth-subtitle" style={{ marginBottom: 0 }}>Summary</h3>
          <button className="cc-btn-secondary" onClick={downloadPdf}>Download PDF</button>
        </div>
        <div className="cc-analytics-row">
          <div className="cc-card cc-analytics-card">
            <div className="cc-analytics-label">Total Salary</div>
            <div className="cc-analytics-value">{salary.totalSalary}</div>
          </div>
          <div className="cc-card cc-analytics-card">
            <div className="cc-analytics-label">Paid</div>
            <div className="cc-analytics-value">{salary.paidSalary}</div>
          </div>
          <div className="cc-card cc-analytics-card">
            <div className="cc-analytics-label">Remaining</div>
            <div className="cc-analytics-value">{salary.remaining}</div>
          </div>
        </div>
      </div>

      <div className="cc-card" style={{ marginBottom: 16 }}>
        <h3 className="cc-auth-subtitle" style={{ marginBottom: 12 }}>Monthly Records</h3>
        <table className="cc-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.month}</td>
                <td>{r.total}</td>
                <td>{r.paid}</td>
                <td>{r.status}</td>
              </tr>
            ))}
            {!records.length && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--cc-muted)' }}>No monthly records</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TeacherSalary;

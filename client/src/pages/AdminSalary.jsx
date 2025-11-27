import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AdminSalary = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [salary, setSalary] = useState({ totalSalary: 0, paidSalary: 0, remaining: 0 });
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ totalSalary: '', paidSalary: '', payIncrement: '' });
  const [recForm, setRecForm] = useState({ month: '', total: '', paid: '', status: 'Not Paid' });
  const [editRecId, setEditRecId] = useState(null);

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

  const loadSalary = async () => {
    if (!selectedId) return;
    setError('');
    try {
      const { data } = await axios.get(`http://localhost:5000/api/teachers/${selectedId}/salary`);
      setSalary(data);
    } catch (e) {
      setError('Failed to load salary');
    }
  };

  const onRecChange = (e) => {
    const { name, value } = e.target;
    setRecForm(f => ({ ...f, [name]: value }));
  };

  const createOrUpdateRecord = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!recForm.month) return setError('Month (YYYY-MM) is required');
    if (recForm.total === '' || isNaN(Number(recForm.total))) return setError('Total is required');
    if (recForm.paid === '' || isNaN(Number(recForm.paid))) return setError('Paid is required');
    const payload = { month: recForm.month, total: Number(recForm.total), paid: Number(recForm.paid), status: recForm.status };
    try {
      if (editRecId) {
        const { data } = await axios.put(`http://localhost:5000/api/teachers/${selectedId}/salary-records/${editRecId}`, payload);
        setRecords(data);
        setSuccess('Record updated');
      } else {
        const { data } = await axios.post(`http://localhost:5000/api/teachers/${selectedId}/salary-records`, payload);
        setRecords(data);
        setSuccess('Record added');
      }
      setRecForm({ month: '', total: '', paid: '', status: 'Not Paid' });
      setEditRecId(null);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to save record');
    }
  };

  const editRecord = (rec) => {
    setEditRecId(rec.id);
    setRecForm({ month: rec.month, total: String(rec.total), paid: String(rec.paid), status: rec.status });
  };

  const deleteRecord = async (id) => {
    if (!confirm('Delete this record?')) return;
    setError('');
    setSuccess('');
    try {
      const { data } = await axios.delete(`http://localhost:5000/api/teachers/${selectedId}/salary-records/${id}`);
      setRecords(data);
      setSuccess('Record deleted');
      if (editRecId === id) { setEditRecId(null); setRecForm({ month: '', total: '', paid: '', status: 'Not Paid' }); }
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete record');
    }
  };

  useEffect(() => { loadSalary(); }, [selectedId]);
  useEffect(() => { loadRecords(); }, [selectedId]);

  const loadRecords = async () => {
    if (!selectedId) return;
    setError('');
    try {
      const { data } = await axios.get(`http://localhost:5000/api/teachers/${selectedId}/salary-records`);
      setRecords(data);
    } catch (e) {
      setError('Failed to load salary records');
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const updateTotals = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const body = {};
      if (form.totalSalary !== '') body.totalSalary = Number(form.totalSalary);
      if (form.paidSalary !== '') body.paidSalary = Number(form.paidSalary);
      const { data } = await axios.put(`http://localhost:5000/api/teachers/${selectedId}/salary`, body);
      setSalary(data);
      setSuccess('Salary updated');
      setForm(f => ({ ...f, totalSalary: '', paidSalary: '' }));
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update salary');
    }
  };

  const downloadPdf = () => {
    const teacher = selectedTeacher || {};
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
        <div>Name: ${teacher.name || ''}</div>
        <div>Email: ${teacher.email || ''}</div>
        <div>Department: ${teacher.department || ''}</div>
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
    if (w) { w.document.open(); w.document.write(html); w.document.close(); }
  };

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-dashboard-header">
        <div>
          <h1 className="cc-dashboard-title">Teacher Salary (Admin)</h1>
          <p className="cc-dashboard-subtitle">Manage salary totals and payments</p>
        </div>
      </div>

      {error && <p className="cc-text-error" style={{ marginBottom: 12 }}>{error}</p>}
      {success && <p className="cc-text-success" style={{ marginBottom: 12 }}>{success}</p>}

      <div className="cc-card" style={{ marginBottom: 32 }}>
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

      <div className="cc-card" style={{ marginBottom: 36 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8 }}>
          <h3 className="cc-auth-subtitle" style={{ marginBottom: 0 }}>Summary</h3>
          <button className="cc-btn-secondary" onClick={downloadPdf} disabled={!selectedTeacher}>Download PDF</button>
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
          <form onSubmit={updateTotals} className="cc-form-grid">
            <div className="cc-form-field">
              <label className="cc-label">Set Total Salary</label>
              <input className="cc-input" name="totalSalary" type="number" min="0" value={form.totalSalary} onChange={onChange} placeholder="e.g. 50000" />
            </div>
            <div className="cc-form-field">
              <label className="cc-label">Set Paid Salary</label>
              <input className="cc-input" name="paidSalary" type="number" min="0" value={form.paidSalary} onChange={onChange} placeholder="e.g. 25000" />
            </div>
            <div className="cc-form-actions">
              <button type="submit" className="cc-btn-primary">Update</button>
            </div>
          </form>
        </div>

        

        
    </section>
  );
};

export default AdminSalary;

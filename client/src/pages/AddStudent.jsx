import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    regno: '',
    mobile: '',
    division: '',
    feeStatus: 'Pending',
  });
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.regno || !form.mobile) {
      setError('Name, Reg No and Mobile are required');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/students', form);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student');
    }
  };

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-card cc-form-compact">
        <h2 className="cc-dashboard-subtitle" style={{ marginBottom: 16 }}>Add Student</h2>
        {error && <p className="cc-text-error">{error}</p>}
        <form onSubmit={onSubmit} className="cc-form">
          <div className="cc-field">
            <label>Name</label>
            <input className="cc-input" name="name" value={form.name} onChange={onChange} required />
          </div>
          <div className="cc-field">
            <label>Reg No</label>
            <input className="cc-input" name="regno" value={form.regno} onChange={onChange} required />
          </div>
          <div className="cc-field">
            <label>Mobile</label>
            <input className="cc-input" name="mobile" value={form.mobile} onChange={onChange} required />
          </div>
          <div className="cc-field">
            <label>Division</label>
            <select className="cc-input" name="division" value={form.division} onChange={onChange}>
              <option value="">Select division</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>
          <div className="cc-field">
            <label>Fee Status</label>
            <select className="cc-input" name="feeStatus" value={form.feeStatus} onChange={onChange}>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Not Paid">Not Paid</option>
            </select>
          </div>
          <button type="submit" className="cc-btn-primary">Create Student</button>
        </form>
      </div>
    </section>
  );
};

export default AddStudent;

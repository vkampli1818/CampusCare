import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: '',
    regno: '',
    mobile: '',
    division: '',
    feeStatus: 'Pending',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/students');
        const foundStudent = data.find(s => s._id === id);
        if (foundStudent) {
          setStudent({
            name: foundStudent.name || '',
            regno: foundStudent.regno,
            mobile: foundStudent.mobile,
            division: foundStudent.division || '',
            feeStatus: foundStudent.feeStatus || 'Pending',
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load student');
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = e => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!student.name || !student.regno || !student.mobile) {
      setError('Name, Reg No and Mobile are required');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/students/${id}`, student);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-card cc-form-compact">
        <h2 className="cc-dashboard-subtitle" style={{ marginBottom: 16 }}>Edit Student</h2>
        {error && <p className="cc-text-error">{error}</p>}
        <form onSubmit={handleSubmit} className="cc-form">
          <div className="cc-field">
            <label>Name</label>
            <input className="cc-input" name="name" value={student.name} onChange={handleChange} />
          </div>
          <div className="cc-field">
            <label>Reg No</label>
            <input className="cc-input" name="regno" value={student.regno} onChange={handleChange} required />
          </div>
          <div className="cc-field">
            <label>Mobile</label>
            <input className="cc-input" name="mobile" value={student.mobile} onChange={handleChange} required />
          </div>
          <div className="cc-field">
            <label>Division</label>
            <input className="cc-input" name="division" value={student.division} onChange={handleChange} placeholder="e.g., A / B / C" />
          </div>
          <div className="cc-field">
            <label>Fee Status</label>
            <select className="cc-input" name="feeStatus" value={student.feeStatus} onChange={handleChange}>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Not Paid">Not Paid</option>
            </select>
          </div>
          <button type="submit" className="cc-btn-primary">Update Student</button>
        </form>
      </div>
    </section>
  );
};

export default EditStudent;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditMarks = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: '',
    cgpa: 0,
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
            cgpa: foundStudent.cgpa || 0,
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
    const value = e.target.name === 'cgpa' ? Number(e.target.value) : e.target.value;
    setStudent({ ...student, [e.target.name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      await axios.put(`http://localhost:5000/api/students/${id}/marks`, { cgpa: student.cgpa });
      navigate('/teacher');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-card cc-form-compact">
        <h2 className="cc-dashboard-subtitle" style={{ marginBottom: 4 }}>Update CGPA</h2>
        {student.name && <div style={{ marginBottom: 12, opacity: 0.9 }}>Student: {student.name}</div>}
        {error && <p className="cc-text-error">{error}</p>}
        <form onSubmit={handleSubmit} className="cc-form">
          <div className="cc-field">
            <label>CGPA</label>
            <input
              className="cc-input"
              type="number"
              name="cgpa"
              value={student.cgpa}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="10"
              required
            />
          </div>
          <button type="submit" className="cc-btn-primary">Update CGPA</button>
        </form>
      </div>
    </section>
  );
};

export default EditMarks;

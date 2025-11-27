import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentList = ({ isAdmin }) => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/students');
        setStudents(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load students');
      }
    };

    fetchStudents();
  }, []);

  const handleEdit = (id) => {
    if (isAdmin) {
      navigate(`/edit-student/${id}`);
    } else {
      navigate(`/edit-marks/${id}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`);
        setStudents(students.filter(student => student._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  const handleAdd = () => {
    navigate('/add-student');
  };

  return (
    <div>
      <h3 className="cc-auth-subtitle" style={{ marginBottom: 12 }}>Student Roster</h3>
      {error && <p className="cc-text-error">{error}</p>}
      {isAdmin && (
        <button className="cc-btn-secondary" style={{ marginBottom: 12 }} onClick={handleAdd}>
          Add Student
        </button>
      )}

      {isAdmin ? (
        <table className="cc-table cc-table-students">
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Division</th>
              <th>Fee Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.regno}</td>
                <td>{student.name}</td>
                <td>{student.mobile}</td>
                <td>{student.division || '—'}</td>
                <td>
                  <span
                    className={
                      'cc-pill ' +
                      (student.feeStatus === 'Paid'
                        ? 'cc-pill-paid'
                        : student.feeStatus === 'Pending'
                        ? 'cc-pill-pending'
                        : 'cc-pill-notpaid')
                    }
                  >
                    {student.feeStatus}
                  </span>
                </td>
                <td>
                  <button className="cc-btn-secondary" onClick={() => handleEdit(student._id)}>
                    Edit
                  </button>
                  <button className="cc-btn-ghost" onClick={() => navigate(`/edit-marks/${student._id}`)} style={{ marginLeft: 8 }}>
                    Edit CGPA
                  </button>
                  <button className="cc-btn-danger" onClick={() => handleDelete(student._id)} style={{ marginLeft: 8 }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="cc-table cc-table-students">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>
                  <button className="cc-btn-secondary" onClick={() => navigate(`/teacher/edit-marks/${student._id}`)}>
                    Add/Update CGPA
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentList;

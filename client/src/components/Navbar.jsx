import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const useNoticeCount = () => {
  const { user } = useAuth();
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) { setCount(0); return; }
      try {
        const { data } = await axios.get('http://localhost:5000/api/notices');
        if (mounted) setCount((data || []).length);
      } catch {}
    };
    load();
    const id = setInterval(load, 30000);
    return () => { mounted = false; clearInterval(id); };
  }, [user]);
  return count;
};

const usePendingLeaveCount = () => {
  const { user } = useAuth();
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user || user.role !== 'admin') { setCount(0); return; }
      try {
        const { data: teachers } = await axios.get('http://localhost:5000/api/auth/teachers');
        const ids = (teachers || []).map(t => t._id);
        const results = await Promise.all(ids.map(id => axios.get(`http://localhost:5000/api/teachers/${id}/leaves`).then(r => r.data).catch(() => [])));
        const pending = results.reduce((sum, arr) => sum + (arr || []).filter(lv => lv.status === 'Pending').length, 0);
        if (mounted) setCount(pending);
      } catch {
        if (mounted) setCount(0);
      }
    };
    load();
    const id = setInterval(load, 60000);
    return () => { mounted = false; clearInterval(id); };
  }, [user]);
  return count;
};

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const noticeCount = useNoticeCount();
  const leaveCount = usePendingLeaveCount();
  const [showRegister, setShowRegister] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/admin-exists');
        if (mounted) setShowRegister(!data?.exists);
      } catch {
        if (mounted) setShowRegister(false);
      }
    };
    check();
    return () => { mounted = false; };
  }, []);
  return (
    <header className="cc-header">
      <div>
        <div className="cc-logo">CampusCare</div>
        <div className="cc-tagline">School Management System</div>
      </div>
      <div className="cc-header-links">
        {!user && showRegister && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{ marginLeft: 12 }}>Register</Link>
          </>
        )}
        {!user && !showRegister && (
          <Link to="/login">Login</Link>
        )}
        {user && user.role === 'admin' && (
          <>
            <a onClick={() => navigate('/admin')}>Dashboard</a>
            <a onClick={() => navigate('/admin/notices')}>Notices{noticeCount ? ` (${noticeCount})` : ''}</a>
            <a onClick={() => navigate('/admin/leaves')}>Leaves{leaveCount ? ` (${leaveCount})` : ''}</a>
          </>
        )}
        {user && user.role === 'teacher' && (
          <>
            <a onClick={() => navigate('/teacher')}>Dashboard</a>
            <a onClick={() => navigate('/teacher/notices')}>Notices{noticeCount ? ` (${noticeCount})` : ''}</a>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;

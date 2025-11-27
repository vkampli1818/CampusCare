import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminEvents = () => {
  const [details, setDetails] = useState('');
  const [amountRs, setAmountRs] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [events, setEvents] = useState([]);

  const loadEvents = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/events');
      setEvents(data);
    } catch (e) {
      // non-blocking
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!details.trim()) {
      setError('Event details are required');
      return;
    }
    if (amountRs === '' || isNaN(Number(amountRs))) {
      setError('Amount (Rs) is required');
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:5000/api/events', {
        details: details.trim(),
        amountRs: Number(amountRs),
      });
      setSuccess('Event created');
      setDetails('');
      setAmountRs('');
      setEvents((prev) => [data, ...prev]);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-dashboard-header">
        <div>
          <h1 className="cc-dashboard-title">Events</h1>
          <p className="cc-dashboard-subtitle">Create and review institute events</p>
        </div>
      </div>

      {error && <p className="cc-text-error" style={{ marginBottom: 12 }}>{error}</p>}
      {success && <p className="cc-text-success" style={{ marginBottom: 12 }}>{success}</p>}

      <div className="cc-card" style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit} className="cc-form-grid">
          <div className="cc-form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="cc-label">Event Details<span style={{ color: '#f66' }}>*</span></label>
            <textarea
              className="cc-input"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the event..."
              required
            />
          </div>
          <div className="cc-form-field">
            <label className="cc-label">Amount (Rs)<span style={{ color: '#f66' }}>*</span></label>
            <input
              className="cc-input"
              type="number"
              min="0"
              value={amountRs}
              onChange={(e) => setAmountRs(e.target.value)}
              placeholder="e.g. 250"
              required
            />
          </div>
          <div className="cc-form-actions">
            <button type="submit" className="cc-btn-primary">Create Event</button>
          </div>
        </form>
      </div>

      <div className="cc-card">
        <h3 className="cc-auth-subtitle" style={{ marginBottom: 12 }}>Recent Events</h3>
        <table className="cc-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Details</th>
              <th>Amount (Rs)</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev._id}>
                <td style={{ maxWidth: 520, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.details}</td>
                <td>{ev.amountRs}</td>
                <td>{new Date(ev.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {!events.length && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: 'var(--cc-muted)' }}>No events yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminEvents;

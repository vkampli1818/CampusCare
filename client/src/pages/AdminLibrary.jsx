import React, { useEffect, useState } from 'react';
import axios from 'axios';

const emptyForm = { title: '', author: '', subject: '', quantity: '' };

const AdminLibrary = () => {
  const [form, setForm] = useState(emptyForm);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);

  const loadBooks = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/books');
      setBooks(data);
    } catch (e) {
      setError('Failed to load books');
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'quantity' ? value.replace(/[^0-9]/g, '') : value }));
  };

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim()) return setError('Title is required');
    if (!form.author.trim()) return setError('Author is required');
    if (!form.subject.trim()) return setError('Subject is required');
    if (form.quantity === '' || isNaN(Number(form.quantity))) return setError('Quantity is required');

    try {
      if (editingId) {
        const { data } = await axios.put(`http://localhost:5000/api/books/${editingId}`, {
          ...form,
          quantity: Number(form.quantity),
        });
        setBooks((prev) => prev.map((b) => (b._id === editingId ? data : b)));
        setSuccess('Book updated');
      } else {
        const { data } = await axios.post('http://localhost:5000/api/books', {
          ...form,
          quantity: Number(form.quantity),
        });
        setBooks((prev) => [data, ...prev]);
        setSuccess('Book added');
      }
      reset();
    } catch (e) {
      setError(e?.response?.data?.message || 'Save failed');
    }
  };

  const startEdit = (book) => {
    setEditingId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      subject: book.subject,
      quantity: String(book.quantity ?? ''),
    });
  };

  const remove = async (id) => {
    if (!confirm('Delete this book?')) return;
    setError('');
    setSuccess('');
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
      setSuccess('Book deleted');
      if (editingId === id) reset();
    } catch (e) {
      setError(e?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <section className="cc-dashboard-wrap">
      <div className="cc-dashboard-header">
        <div>
          <h1 className="cc-dashboard-title">Library</h1>
          <p className="cc-dashboard-subtitle">Manage books by subject and author</p>
        </div>
      </div>

      {error && <p className="cc-text-error" style={{ marginBottom: 12 }}>{error}</p>}
      {success && <p className="cc-text-success" style={{ marginBottom: 12 }}>{success}</p>}

      <div className="cc-card" style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit} className="cc-form-grid">
          <div className="cc-form-field">
            <label className="cc-label">Title<span style={{ color: '#f66' }}>*</span></label>
            <input className="cc-input" name="title" value={form.title} onChange={onChange} placeholder="e.g. Data Structures" required />
          </div>
          <div className="cc-form-field">
            <label className="cc-label">Author<span style={{ color: '#f66' }}>*</span></label>
            <input className="cc-input" name="author" value={form.author} onChange={onChange} placeholder="e.g. Mark Allen Weiss" required />
          </div>
          <div className="cc-form-field">
            <label className="cc-label">Subject<span style={{ color: '#f66' }}>*</span></label>
            <input className="cc-input" name="subject" value={form.subject} onChange={onChange} placeholder="e.g. Computer Science" required />
          </div>
          <div className="cc-form-field">
            <label className="cc-label">Quantity<span style={{ color: '#f66' }}>*</span></label>
            <input className="cc-input" name="quantity" type="number" min="0" value={form.quantity} onChange={onChange} placeholder="e.g. 10" required />
          </div>
          <div className="cc-form-actions">
            {editingId ? (
              <>
                <button type="submit" className="cc-btn-primary">Update Book</button>
                <button type="button" className="cc-btn-ghost" onClick={reset}>Cancel</button>
              </>
            ) : (
              <button type="submit" className="cc-btn-primary">Add Book</button>
            )}
          </div>
        </form>
      </div>

      <div className="cc-card">
        <h3 className="cc-auth-subtitle" style={{ marginBottom: 12 }}>Books</h3>
        <table className="cc-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Subject</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b._id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.subject}</td>
                <td>{b.quantity}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="cc-btn-secondary" onClick={() => startEdit(b)}>Edit</button>
                    <button className="cc-btn-danger" onClick={() => remove(b._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!books.length && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--cc-muted)' }}>No books yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminLibrary;

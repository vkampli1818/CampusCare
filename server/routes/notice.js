const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Notice = require('../models/Notice');

// All routes require auth
router.use(auth);

// GET /api/notices - admin and teacher can view
router.get('/', role(['admin', 'teacher']), async (req, res) => {
  try {
    const notices = await Notice.find().sort({ dateTime: -1, createdAt: -1 });
    res.json(notices);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/notices - admin only
router.post('/', role(['admin']), async (req, res) => {
  const { title, details, dateTime, venue } = req.body;
  if (!title || !dateTime) return res.status(400).json({ message: 'title and dateTime are required' });
  try {
    const n = await Notice.create({ title: String(title), details: details || '', dateTime: new Date(dateTime), venue: venue || '', createdBy: req.user.id });
    const notices = await Notice.find().sort({ dateTime: -1, createdAt: -1 });
    res.status(201).json(notices);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/notices/:id - admin only
router.put('/:id', role(['admin']), async (req, res) => {
  const { id } = req.params;
  const { title, details, dateTime, venue } = req.body;
  try {
    const n = await Notice.findById(id);
    if (!n) return res.status(404).json({ message: 'Notice not found' });
    if (title !== undefined) n.title = String(title);
    if (details !== undefined) n.details = String(details);
    if (venue !== undefined) n.venue = String(venue);
    if (dateTime !== undefined) n.dateTime = new Date(dateTime);
    await n.save();
    const notices = await Notice.find().sort({ dateTime: -1, createdAt: -1 });
    res.json(notices);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/notices/:id - admin only
router.delete('/:id', role(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    await Notice.findByIdAndDelete(id);
    const notices = await Notice.find().sort({ dateTime: -1, createdAt: -1 });
    res.json(notices);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const User = require('../models/User');

// GET /api/teachers/:id/leaves - admin and teacher
exports.getTeacherLeaves = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await User.findById(id);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher.leaves || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/teachers/:id/leaves - teacher appeal (cap 5 per month)
exports.addTeacherLeave = async (req, res) => {
  const { id } = req.params;
  const { date, reason } = req.body;
  if (!date) return res.status(400).json({ message: 'date is required' });
  try {
    // Only the authenticated teacher can file their own leave appeal
    if (!req.user || String(req.user.id) !== String(id) || req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only the teacher can appeal their own leave' });
    }
    const teacher = await User.findById(id);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    const leaveDate = new Date(date);
    const monthStart = new Date(leaveDate.getFullYear(), leaveDate.getMonth(), 1);
    const monthEnd = new Date(leaveDate.getFullYear(), leaveDate.getMonth() + 1, 0, 23, 59, 59, 999);
    const monthlyCount = (teacher.leaves || []).filter(lv => {
      const d = new Date(lv.date);
      return d >= monthStart && d <= monthEnd;
    }).length;
    if (monthlyCount >= 5) {
      return res.status(400).json({ message: 'Monthly leave limit (5) reached for this teacher' });
    }

    const leave = {
      date: new Date(date),
      reason: reason || '',
      status: 'Pending',
    };
    teacher.leaves = teacher.leaves || [];
    teacher.leaves.push(leave);
    await teacher.save();
    res.status(201).json(teacher.leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/teachers/:id/leaves/:leaveId - admin approves/rejects only
exports.updateTeacherLeave = async (req, res) => {
  const { id, leaveId } = req.params;
  const { status } = req.body;
  try {
    const teacher = await User.findById(id);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    const l = (teacher.leaves || []).find(lv => String(lv.id) === String(leaveId));
    if (!l) return res.status(404).json({ message: 'Leave not found' });

    // Admin can only change status
    if (status !== undefined && ['Pending', 'Approved', 'Rejected'].includes(status)) {
      l.status = status;
    }

    await teacher.save();
    res.json(teacher.leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE removed intentionally; appeals are not deletable by admin
